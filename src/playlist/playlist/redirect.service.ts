import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Redirect } from '../redirect.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RedirectService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Redirect)
    private readonly redirectRepository: Repository<Redirect>,
  ) {}

  async findBySourceUrlRecursively(url: string): Promise<Redirect> {
    if (url === '') {
      return Promise.resolve({
        id: '12212',
        sourceUrl: '',
        targetUrl: 'https://youtube.com/kabarakh',
      });
    }
    const redirect: Redirect = await this.redirectRepository.findOne({
      sourceUrl: url,
    });
    if (!redirect) {
      return await this.findBySourceUrlRecursively(
        url.replace(/(.*)(\/[^\/]+)$/, ''),
      );
    }
  }

  async loadAll(): Promise<Redirect[]> {
    return await this.redirectRepository.find();
  }
}
