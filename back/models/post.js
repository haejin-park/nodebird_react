const DataTypes = require('sequelize');
const {Model} = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init({
            //id가 기본적으로 들어있다
            content: {
                type:DataTypes.TEXT,
                allowNull:false
            },
        }, {
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',//
            collate: 'utf8mb4_general_ci',//이모티콘 저장
            sequelize
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.User); //작성자 post.addUser, post.getUser, post.setUsert 
        db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'}); //post.addHashtags
        db.Post.hasMany(db.Comment); //post.addComments, post.getComments
        db.Post.hasMany(db.Image); //post.addImages, post.getImages
        db.Post.belongsTo(db.Post, {as: 'Retweet'}); //post.addRetweet
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers'}); //좋아요 누른 사람들 post.addLikers, post.removeLikers
    }
}