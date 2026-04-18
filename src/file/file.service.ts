import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase URL or Key is missing. Image upload might fail.');
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async uploadImage(file: any): Promise<string> {
    if (!this.supabase) {
      throw new BadRequestException('Supabase client is not configured.');
    }

    const bucketUrl = this.configService.get<string>('SUPABASE_BUCKET_URL');
    if (!bucketUrl) {
      throw new BadRequestException('SUPABASE_BUCKET_URL is not configured.');
    }

    // Extract bucket name from URL. Expected format: https://.../public/bucketName
    // We split by / and filter out empty strings to avoid issues with trailing slashes
    const parts = bucketUrl.split('/').filter(Boolean);
    const bucketName = parts.pop();

    if (!bucketName || bucketName.includes('.') || bucketName === 'public') {
      throw new BadRequestException('Invalid SUPABASE_BUCKET_URL. Could not determine bucket name.');
    }

    const fileExt = (file.originalname as string).split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `books/${fileName}`;

    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer as Buffer, {
        contentType: file.mimetype as string,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Supabase upload error: ${error.message}`);
    }

    // Return the full URL
    return `${bucketUrl}/${filePath}`;
  }
}
