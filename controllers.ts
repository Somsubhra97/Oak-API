import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';

import {getDb} from "./mongodb.ts";

interface Notes{
  title:string,
  body:string,
  date:Object
  id?:Object
}

const notesCollection = getDb().collection("notes");

const getNotes = async (ctx: RouterContext) => {
   const notes = await notesCollection.find();
   ctx.response.body = notes;
};

const getSingleNote = async (ctx: RouterContext) => {
  const id = ctx.params.id; 
  const note = await notesCollection.findOne({ _id: ObjectId(id)});

  ctx.response.body = note;
};

const createNote = async (ctx: RouterContext) => {/////

  const { value: {title, body} } = await ctx.request.body(); 
  const note: Notes = {
    title,
    body,
    date: new Date(),
  };
  const res:Notes = await notesCollection.insertOne(note);
  
  ctx.response.status = 201;
  ctx.response.body = res;
};

const updateNote = async (ctx: RouterContext) => {
  if(!ctx.request.hasBody()){
    ctx.response.status = 404;
    ctx.response.body = { message: "Note does not exist" };
    return;
  }
  
  const id = ctx.params.id;  
  const { value: {title, body} } = await ctx.request.body();
  const check:boolean=await notesCollection.findById(ObjectId(id));
  
  if(!check){
    ctx.response.status = 404;
    ctx.response.body = { message: "Note does not exist" };
    return;
  }

  const { modifiedCount } = await notesCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        title,
        body,
      },      
    },
  );
  
  ctx.response.body = await notesCollection.findOne({ _id: ObjectId(id) });
};

const deleteNote = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const count = await notesCollection.deleteOne({ _id: ObjectId(id) });
  if (!count) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Note does not exist" };
    return;
  }

  ctx.response.status = 204;
};

export { getNotes, createNote, getSingleNote, updateNote, deleteNote };
