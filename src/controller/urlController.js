const Url = require('../model/url');
const validUrl = require('valid-url');
const shortId = require('short-id');
const {SET_ASYNC,GET_ASYNC} = require('../utils/utils');



const isValid = (value) => {
    if(typeof value === "undefined" || value === null) return false;
    if(typeof value === "string" && value.trim().length < 1) return false;
    return true;
};    


const baseUrl =  "http://localhost:3000/";

const createUrl = async(req,res)=>{
 try {
    const longUrl = req.body.longUrl;
    if(Object.keys(longUrl).length < 1) {
        return res.status(400).send({status:false,msg:"Provide Properties in the body"})
    }
    if(!isValid(longUrl)) return res.status(400).json({status:false,message:"invalid long URL!"});

    if(!validUrl.isWebUri(longUrl)){
        return res.status(400).send({status:false,msg:"please Enter the Valid Url"});
    };
    
    const cachedUrl = await GET_ASYNC(longUrl);
    if (cachedUrl) {
        // if present then send it to user
      const { shortUrl , urlCode} = JSON.parse(cachedUrl);
      return res.status(202).send({
        status: true,
        message: 'Already available',
        urlCode,
        shortUrl,
      });
    }

    const url = await Url.findOne({longUrl});
    if(url){
        await SET_ASYNC(
            longUrl,
            JSON.stringify({
              urlCode: url.urlCode,
              shortUrl: url.shortUrl,
            }),
            'EX',
            24 * 60 * 60
          );
    };
    const urlCode = shortId.generate();
    const shortUrl = baseUrl + urlCode;
    const details = {longUrl,shortUrl,urlCode};
    const saveUrl = await Url.create(details);

    const result = {
        longUrl:saveUrl.longUrl,
        shortUrl:saveUrl.shortUrl,
        urlCode:saveUrl.urlCode
    }
    await SET_ASYNC(
        longUrl,
        JSON.stringify({
          urlCode: url.urlCode,
          shortUrl: url.shortUrl,
        }),
        'EX',
        24 * 60 * 60
      );
    res.status(202).json({status:true,data:result});
 } catch (error) {
    res.status(400).json({status:false,message:error.message});
 }
};

const getUrl = async(req,res)=>{
   try {
    const {urlCode} = req.params;
    const cachedUrl = await GET_ASYNC(urlCode);
    if (cachedUrl) {
        // if present then send it to user
      const { longUrl } = JSON.parse(cachedUrl);
      return res.status(302).redirect(longUrl);
    }
    
    const checkCode = await Url.findOne({urlCode});
    
    if(!checkCode) return res.status(400).json({status:false,message:"invalid URL code!"});
    await SET_ASYNC(
        urlCode,
        JSON.stringify({
          longUrl: checkCode.longUrl
        }),
        'EX',
        24 * 60 * 60
      );
    res.status(302).redirect(checkCode.longUrl); 
   } catch (error) {
    res.status(400).json({status:false,message:error.message});
   }
}

module.exports = {createUrl,getUrl};

