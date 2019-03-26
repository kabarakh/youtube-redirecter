import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as Fastify from 'fastify';
import * as fastifyUrlData from 'fastify-url-data';

const fastify = Fastify({});

fastify.register(fastifyUrlData);

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(fastify));
    await app.listen(3000);
}
bootstrap();
