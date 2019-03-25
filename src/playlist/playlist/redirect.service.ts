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

  async findBySourceUrl(url: string): Promise<Redirect> {
    return await this.redirectRepository.findOne({ sourceUrl: url });
  }

  async loadAll(): Promise<Redirect[]> {
    return await this.redirectRepository.find();
  }
}
