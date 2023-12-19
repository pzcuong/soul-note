import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserModel extends CommonModel {
    constructor(
        @InjectRepository(User)
        public repository: Repository<User>,
    ) {
        super();
    }
}
