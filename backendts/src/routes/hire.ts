import { Router, Request, Response, RequestHandler } from "express";
import multer from "multer";
import zod from "zod";
import {supabase } from "../config/supabase";
import parseResume from "./resumeParser";
import userapplied  from "./serviceNowIntegration";

// Multer Storage for handling file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Zod Validation Schema
const hireSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.string().email("Invalid email format"),
  phone: zod.string().min(10, "Invalid phone number"),
  jobnumber: zod.string().min(1, "Job number is required"),
});

const router = Router();

router.post(
  "/hire",
  upload.single("resume"),
  (async (req: Request, res: Response) => {
    try {
      // Validate request body
      const { name, email, phone, jobnumber } = req.body;
      const validation = hireSchema.safeParse({ name, email, phone, jobnumber });

      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "Resume file is required" });
        return;
      }

      // 1. Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resume")
        .upload(`public/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        res.status(500).json({ error: uploadError.message });
        return;
      }

      // 2. Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("resume")
        .getPublicUrl(uploadData.path);

      // 3. Create record in Supabase database
      const { error: dbError } = await supabase
        .from("user_applied")
        .insert([
          {
            name,
            email,
            phone,
            jobnumber,
            resume_url: urlData.publicUrl,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        // If database insert fails, delete the uploaded file
        await supabase.storage
          .from("resume")
          .remove([uploadData.path]);
        res.status(500).json({ error: dbError.message });
        return;
      }

      // 4. Parse resume
      const resumeParser = await parseResume(urlData.publicUrl);
      if (!resumeParser) {
        res.status(500).json({ error: "Resume parser failed" });
        return;
      }

      // 5. Send data to ServiceNow
      const finaldata = {
        name,
        email,
        phone,
        jobnumber,
        resume_url: urlData.publicUrl,
        resume_parsed: resumeParser
      };
      
      const sncdata = await userapplied(finaldata);
      if (!sncdata) {
        res.status(500).json({ error: "ServiceNow data upload failed" });
        return;
      }

      // 6. Send final success response
      res.status(200).json({ 
        message: "Application submitted successfully",
        fileUrl: urlData.publicUrl,
        serviceNowRecord: "Record created in ServiceNow"
      });

    } catch (error: any) {
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }) as unknown as RequestHandler
);

export default router;
