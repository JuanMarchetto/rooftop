const axios = require('axios').default;
require('dotenv').config()

const BASE_URL = "https://rooftop-career-switch.herokuapp.com/";

const API = async (
  method: 'get' | 'post',
  url: string,
  params?: {
    blocks?: Array<string>,
    encoded?: string
  }
) => {
  return await axios[method](
    `${BASE_URL}${url}?token=${process.env.TOKEN}`,
    params
  )
  .then(({ data }:{data:{message?:string, data:Array<string>}}) => data)
};

const getBlocks = () => API('get', 'blocks');

const getCheck = (firstBlock: string, secondBlock: string) =>
  API('post', 'check', { blocks: [firstBlock, secondBlock] });

const getConfirmation= (encoded: string,) =>
  API('post', 'check', { encoded });

const getNext = (acc:Array<string>, blocks:Array<string> )=>{
  return blocks.filter((block)=>!acc.includes(block)).find(async(block)=>{
    const check = await getCheck(acc[acc.length-1],block)
    return check.message
  })
}

(async () => {
  const {data: blocks} = await getBlocks()
  console.log(blocks);
  const relations = blocks.reduce(
    (acc:Array<string>, val:string)=>[
      ...acc,
      !acc.length || acc.length === blocks.length -1 ? val : getNext(acc, blocks)
    ],
    []
  )

  console.log(relations)
  const result = await getConfirmation(relations.join(''))
  console.log(result)
})()