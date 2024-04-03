// Import necessary libraries and modules
// Імпорт необхідних бібліотек та модулів

import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Define the S3 bucket name
// Визначення імені бакета S3

const bucketName = 'next-codecraftinglab';

// Handler function to process the file upload request
// Функція обробки запиту на завантаження файлу

export default async function handle(req, res) {
  // Connect to MongoDB using mongoose
  // Підключення до MongoDB за допомогою mongoose
  await mongooseConnect();

  // Check if the request is from an admin
  // Перевірка, чи запит від адміністратора
  await isAdminRequest(req, res);

  // Create a new multiparty form instance
  // Створення нового екземпляру форми multiparty
  const form = new multiparty.Form();

  // Parse the form data to extract fields and files
  // Розбір даних форми для виділення полів та файлів
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  // Create an S3 client with AWS credentials
  // Створення клієнта S3 з обліковими даними AWS
  const client = new S3Client({
    region: 'eu-west-3',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // Initialize an array to store generated S3 links
  // Ініціалізація масиву для зберігання створених посилань S3
  const links = [];

  // Iterate over each file and upload it to S3
  // Ітерація по кожному файлу та його завантаження в S3
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;

    // Send a PutObject command to upload the file to S3
    // Відправлення команди PutObject для завантаження файлу в S3
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path),
    }));

    // Generate a public-read link for the uploaded file
    // Генерація посилання з правом читання для завантаженого файлу
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  // Return the generated S3 links in the response
  // Повернення згенерованих посилань S3 у відповіді
  return res.json({ links });
}

// Configuration for the API route to disable the default body parser
// Конфігурація API-маршруту для вимкнення стандартного розбірника тіла
export const config = {
  api: { bodyParser: false },
};
