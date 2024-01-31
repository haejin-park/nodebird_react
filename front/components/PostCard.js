import React, {useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Popover, Button, Avatar, List, Comment } from 'antd';
import { RetweetOutlined, HeartTwoTone, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';
moment.locale('ko');
const PostCard = ({post}) => {
    const dispatch = useDispatch();
    const { updateImagePaths, removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me?.id);
    const [editMode, setEditMode] = useState(false);
    const [updateImages, setUpdateImages] = useState(post.Images || []);
    // console.log('PostCard에서 post ', post);
    // console.log('PostCard에서 updateImages ', updateImages);

    const onClickUpdate = useCallback(() => {
        setEditMode(true);
    },[]); 
    const onCancelUpdate = useCallback(() => {
        setEditMode(false);
    }, []);
    const onChangePost = useCallback((editText) => () => {
        const formData = new FormData();
        formData.append('updateImages', updateImages);
        updateImagePaths.forEach((p) => {
            formData.append('image', p);
        });
        formData.append('content', editText);
        formData.append('PostId', post.id);        
        dispatch({
            type: UPDATE_POST_REQUEST,
            data: formData,
        });
        setEditMode(false);
    },[post, updateImagePaths, setEditMode]);
    const onLike = useCallback(() => {
        if(!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({ 
            type: LIKE_POST_REQUEST,
            data: post.id
        });
    }, [id]);
    const onUnlike = useCallback(() =>{
        if(!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id 
        })
    }, [id]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        if(!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type:REMOVE_POST_REQUEST,
            data:post.id,
        });
    }, [id]);
    const onRetweet = useCallback(() => {   
        if(!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id]);
    
    const liked = post.Likers.find((v) => v.id === id);

    return (
        <div style = {{marginBottom:20}}>
            <Card
                cover={updateImages[0] && 
                    <PostImages 
                        imagePost={post} 
                        editMode={editMode} 
                        updateImages={updateImages}
                        setUpdateImages={setUpdateImages}                    
                    />
                }
                actions={[
                    <RetweetOutlined key="retweet" onClick={onRetweet}/>,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike}/> 
                        : <HeartOutlined key="heart" onClick={onLike}/>,                    
                    <MessageOutlined key="comment" onClick={onToggleComment}/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {id && post.User.id === id ? ( 
                            <>
                                {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
                                <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                            </>
                            ) : <Button>신고</Button>}
                        </Button.Group>
                    )}>
                        <EllipsisOutlined/>
                    </Popover>
                ]}
                title={post.RetweetId? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
                extra={id && <FollowButton post={post} />}
            >
                {post.RetweetId && post.Retweet
                    ? (
                        <Card
                            cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images}/>}
                        >
                            <div style={{float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
                            <Card.Meta 
                                avatar={( 
                                        <Link href={`/user/${post.Retweet.User.id}`} prefecth={false}>
                                            <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                                        </Link>
                                        )}
                                title={post.Retweet.User.nickname}
                                description={
                                    <PostCardContent 
                                        postContent={post.Retweet.content}
                                        onChangePost={onChangePost} 
                                        onCancelUpdate={onCancelUpdate} 
                                    />
                                }
                            />
                        </Card>
                    )
                    : (
                        <>
                            <div style={{float: 'right'}}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
                            <Card.Meta 
                                avatar={(
                                        <Link href={`/user/${post.User.id}`} prefecth={false}>
                                            <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                        </Link>
                                        )}
                                title={post.User.nickname}
                                description={
                                    <PostCardContent 
                                        postContent={post.content}
                                        editMode={editMode} 
                                        onChangePost={onChangePost} 
                                        onCancelUpdate={onCancelUpdate} 
                                    />
                                }
                            />
                        </>
                    )
                }

            </Card>
            {commentFormOpened && (
                <div>
                    <CommentForm post={post}/>
                    <List
                        header={`${post.Comments.length}개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={(
                                            <Link href={`/user/${item.User.id}`} prefecth={false}>
                                                <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                                            </Link>
                                            )}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

PostCard.propTypes = {
    post:PropTypes.shape({
        id:PropTypes.number,
        User:PropTypes.object,
        content:PropTypes.string,
        createAt:PropTypes.string,
        Comments:PropTypes.arrayOf(PropTypes.object),
        Images:PropTypes.arrayOf(PropTypes.object),
        Likers:PropTypes.arrayOf(PropTypes.object),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any),
    }).isRequired,
}

export default PostCard;