export const runtime = "nodejs";
import { getFormStats } from '@/actions/formStats'
import Analytics from '@/components/Analytics' 
import connectDb from '@/lib/mongodb';
import React from 'react'

const page =  async () => {
  await connectDb();
   const data = await getFormStats();
   
  return (
    <div>
        <Analytics noOfSubmissions={data || 0}/>
    </div>
  )
}

export default page