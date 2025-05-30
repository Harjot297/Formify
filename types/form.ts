export type Fields = {
    name :string;
    label :string;
    placeholder?:string;
}
export type Content = { 
    title:string;
    fields:Fields[]
}
export type Form = {
    id:string;
    ownerId:string;
    published:boolean;
    content:Content;
    submissions:number;
    shareUrl:string;
}