import {  Router } from "https://deno.land/x/oak/mod.ts";
const router = new Router();

import {getNotes, createNote, getSingleNote, updateNote, deleteNote} from './controllers.ts';

router
  .get('/notes', getNotes)
  .get('/notes/:id', getSingleNote)
  .post('/notes', createNote)
  .put('/notes/:id', updateNote)
  .delete('/notes/:id', deleteNote);

  export default router;