const express = require("express")
const cors = require('cors')

const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const mysql = require('mysql2/promise')
// set env variables
const secureEnv = require('secure-env')
global.env = secureEnv({secret:'password'})
const PORT=global.env.PORT

// set sql variables
const pool = mysql.createPool({
    host: global.env.DB_HOST,
    port: global.env.DB_PORT,
    user: global.env.DB_USER,
    password: global.env.DB_PASS,
    database: global.env.DB_NAME,
    connectionLimit: global.env.DB_CONNECTIONLIMIT,
    timezone: global.env.DB_TIMEZONE
})

// SQL statments
const SQL_INSERT_TASK = 'insert into task (task_name, imageurl,createdDate) values (?,?, curdate())'
const SQL_INSERT_SUB_TASK = 'insert into sub_task (description, date, task_id) values ?'
const SQL_INSERT_IMAGE_URL = 'insert into task (imageurl, task_name,createdDate) values (?,?,curdate())'

// make transaction
const INSERT_TASK = async (taskName,imageUrl,subTasks)=>{
    const conn = await pool.getConnection()
    try{
        await conn.beginTransaction()
        const taskResult = await conn.query(SQL_INSERT_TASK,[taskName,imageUrl])
        const insertId =taskResult[0].insertId
        // console.log('main task',taskResult[0])
        let finalResult = [taskResult[0]]
        let values = []
        subTasks.forEach((ele)=>{
            values.push([ele.description, ele.date,insertId])
        })
        console.log(values)
        const subTaskResults = await conn.query(SQL_INSERT_SUB_TASK,[values])
        // console.log('subtask',subTaskResults[0])
        finalResult = [...finalResult,subTaskResults[0]]
        conn.commit()
        console.log('final',finalResult)
    }catch(err){
        conn.rollback()
        console.log('err in insert task',err)
        throw err
    }finally{
        conn.release()
    }
}

// new instance of S3 configure endpoint
const endpoint = new AWS.Endpoint('sfo2.digitaloceanspaces.com')
const s3 = new AWS.S3({
    endpoint: endpoint
})

// create multers3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: global.env.AWS_BUCKET,
        acl:'public-read',
        metadata: function(req,file,cb){
            cb(null,{
                orignal: file.originalname,
                field: file.fieldname,
                mimetype: file.mimetype
            })
        },
        key: function(req,file,cb){
            cb(null, Date.now().toString())
        }

    })
})

// check if database connected
startApp = async (pool,app)=>{
    const conn = await pool.getConnection()
    try{
        s3.config.getCredentials((err,cred)=>{
            if (err){
                console.log('no credientials file loaded')
                throw err
            }
            else{
                console.log('credentials loaded from credentials file')
            }
        })
        await conn.ping()
        console.log('pinging database')
        app.listen(PORT,()=>{
            console.log(`APP started on ${PORT} on ${new Date()}`)
        })
        
    }catch(e){
        console.log('error',e)
    }finally{
        conn.release()
    }
}
// resources
const app = express()

// enable cors
app.use(cors())
// enable json
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/form', upload.single('image'), async (req,res)=>{
    const formData = req.body
    console.log('formDate',formData)
    const taskName = req.body.taskName
    const imageUrl = req.body.imageUrl
    const subTasks = req.body.data
    try{
        await INSERT_TASK(taskName,imageUrl,subTasks)
        res.status(200).type('application/json').json({message:'success'})
    }catch(err){
        console.log('err in post',err)
        res.status(500).json({'error':err.message})
    }

})

app.post('/upload',upload.single('image'),async(req,res)=>{
    const result = req.file
    console.log(result)
    const conn = await pool.getConnection()
    await conn.query(SQL_INSERT_IMAGE_URL,[result.location,req.body.taskName])
    res.send({
        'message':'success',
        'imageurl':result.location
    })
})


// app listening
startApp(pool,app)


