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

(async () => {
  const {data: blocks} = await getBlocks()
  console.log(blocks);
  const {message: check} = await getCheck(blocks[0], blocks[1])
  console.log(check)
})()