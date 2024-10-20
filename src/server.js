import express from 'express'


import {db,connectToDb} from './db.js'

const app = express();

app.use(express.json());

app.get('/api/articles/:name',async(req,res)=>{
    const {name} = req.params;
    const article = await db.collection('articles').findOne({name});

    if(article){
        res.json(article)
    }
    else{
        res.sendStatus(404)
    } 
})


app.post('/api/articles/:name/comments',async(req,res)=>{
    const {name} = req.params;
    const {postedBy,text} = req.body

    await db.collection('articles').updateOne({name},{
        $push:{comments:{ postedBy,text } },

    })
    const article = await db.collection('articles').findOne({name})
    if(article){
        article.comments.push({postedBy,text});
        res.send(article.comments)
    }
    else{
        res.send('That article doesn\'t exist.');
    }
});

app.put('/api/articles/:name/upvote',async(req,res)=>{
    const {name} = req.params;

    await db.collection('articles').updateOne({name},{
        $inc: { upvotes: 1 },
    })

    const article = await db.collection('articles').findOne({name});
    if(article){
        article.upvotes += 1;
        res.send(`The ${name} article now has ${article.upvotes} upvotes!`);
    }
    else{
        res.send('That article doesn\'t exist.');
    }
});

connectToDb(()=>{
    console.log('Successfull coneect to db')
    app.listen(8000,()=>{
        console.log('Sever is listening on port 8000');
    });
})
