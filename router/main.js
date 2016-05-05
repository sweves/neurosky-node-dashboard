module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/visuals',function(req,res){
        res.render('visualizer.html')
     });
}