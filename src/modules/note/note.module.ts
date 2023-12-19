import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { ModelsModule } from 'src/models/models.module';

@Module({
    controllers: [NoteController],
    providers: [NoteService],
    imports: [ModelsModule],
})
export class NoteModule {}
