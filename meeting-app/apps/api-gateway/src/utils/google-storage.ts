import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AwsService {
    constructor(private readonly configService: ConfigService) { }

    getBucket() {

        let projectId = this.configService.get('GOOGLE.projectId');

        let keyFilename = '../mykey.json'

        const storage = new Storage({
            projectId,
            keyFilename,
        });

        return storage.bucket(this.configService.get('GOOGLE.storageBucket'));
    }

    upload(file: Express.Multer.File, res: Response) {
        try {

            const bucket = this.getBucket();
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();
            blobStream.end(file.buffer);
        } catch (error) {
            res.status(500).send(error);
        }
    }


}
