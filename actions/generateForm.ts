"use server"

import { currentUser } from "@clerk/nextjs/server"
import {z} from "zod"
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "AIzaSyCs33Q1fWolZN-fA9ubGuVyZQw1KKplxm8" });
import {Form} from "@/models/Form"
import { revalidatePath } from "next/cache";
import connectDb from "@/lib/mongodb";

export const generateForm = async (prevState : unknown , formData : FormData) => {
    try{
        await connectDb();
        const user = await currentUser();
        if(!user){
            return {success : false, message : "User not found"};
        }
        // define schema for validation using zod
        const schema = z.object({
            description : z.string().min(1,"Description is missing")
        });
        const result = schema.safeParse({
            description : formData.get("description") as string
        });
        if(!result.success){
            return {success : false, message : "Invalid form data" , error : result.error.errors}
        }
        const description = result.data.description;

        const prompt = "Create a JSON Form with the following fields : title , fields(If any field include options then keep it inside array not object ) , button . Just return the JSON object nothing else , Do provide placeholder . ";


        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `${description} ${prompt}`,
        });

        let formatResponse = response.text?.replace("json","");
        formatResponse = formatResponse?.replaceAll("`","");
        console.log("Gemini Response : ", formatResponse);

        const formContent = formatResponse;
        if(!formContent){
            return {success : false, message : "Failed to generate form content"};
        }

        // convert form to json
        let formJsonData;
        try{
            formJsonData = JSON.parse(formContent);
        }
        catch(error){
            console.log("Error parsing JSON : " , error);
            return {success : false, message : "Generated form content is not valid JSON"};
        }

        // save the generated form to database
        const savedForm = await Form.create({
            ownerId: user.id,
            content : formJsonData ? formJsonData : null,
        })
        const formattedForm = {
            id : savedForm._id.toString(),
            ownerId: savedForm.ownerId.toString(),
            published: savedForm.published,
            content: savedForm.content,
            submissions: savedForm.submissions,
            shareUrl: savedForm.shareUrl,
        }
        console.log("Successfuly generated form")
        revalidatePath("/dashboard/forms");
        
        return {
            success : true,
            message: "Form Generated Successfully",
            data : formattedForm,
        }

    }
    catch(err){
        console.log("Error Generating Form : ", err);
        return {
            success : false,
            message : "An error occured while generating form "
        }
    }
}