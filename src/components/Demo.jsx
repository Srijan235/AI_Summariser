import React from 'react'
import { useState,useEffect } from 'react'
import {copy, linkIcon,loader,tick} from "../assets";
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  
  const [article,setArticle]=useState({
    url:'',
    summary:'',
  });

  const [allarticles,setallarticles]=useState([]);

  useEffect(()=>{
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setallarticles(articlesFromLocalStorage);
    }
  },[]);

   
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();


  const handleSubmit = async(e)=>{
    e.preventDefault();
        
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updateallarticles= [newArticle,...allarticles];
      
      setallarticles(updateallarticles);
      setArticle(newArticle);
      // console.log(newArticle);
  
      localStorage.setItem("articles", JSON.stringify(updateallarticles));
  }


}

  return (
    <section className='mt-16 w-full max-w-xl'> 
    <div className='flex flex-col w-full gap-5'>
      <form className='relative flex justify-center items-centre' onSubmit={handleSubmit}>
      
       <img src={linkIcon} className='absolute left-0 my-2 ml-3 w-5'></img>

       <input type="url" placeholder='Enter A URL' value={article.url} onChange={(e)=>setArticle({...article,url:e.target.value})} required className='url_input peer' >
       
       </input>
       <button type="submit" className='submit_btn '>
       <p className='text-gray-950'>↵</p>
       </button>
      

      </form>
    {/* Browse Result BABY */}

    <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
    {allarticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
            <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                src={copy}
                  // src={copied === item.url ? tick : copy}
                  // alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
    ))}
    </div>
      
    </div>
    
    <div className='my-10 max-w-full flex justify-center items-center'>
         {isFetching ? (
            <img src={loader} className='w-20 h-20 object-contain '>

            </img>

         ) :error ? (
          <p className='font-inter font-bold text-black text-center'>WELL not Supposed to happen
           <br></br>
           <span className='font-satoshi font-normal'>
            {error?.data?.error}
           </span>
           
           </p>
         ) :(

          article.summary && (
            <div  className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>Article  
                <span className='blue_gradient mx-1 '>
                    Summary
                </span>
              </h2>

              <div className='summary_box'> 
              <p className='font-inter font-medium text-sm text-gray-700'>{article.summary}</p>
              
              </div>
              </div>
          )
         )}

         
    </div>

    </section>
  )
}

export default Demo