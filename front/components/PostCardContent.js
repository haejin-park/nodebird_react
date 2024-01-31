import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {Button, Form, Input} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_IMAGES_REQUEST, REMOVE_UPDATE_IMAGE } from '../reducers/post';
const {TextArea} = Input;
const PostCardContent = ({
        postContent, 
        editMode, 
        onChangePost, 
        onCancelUpdate
    }) => { //첫 번째 게시글 #해시태그 #행복한집사생활 에서 해시태그 
    const dispatch = useDispatch();
    const {updateImagePaths, updatePostLoading, updatePostDone} = useSelector((state) => state.post);
    const [editText, setEditText] = useState(postContent); //porps를 state로

    const onChangeText = useCallback((e) => {
        setEditText(e.target.value);
    });

    const imageInput =  useRef();

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImages = useCallback((e) => {
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPDATE_IMAGES_REQUEST,
            data: imageFormData,
        });
    });

    const onRemoveImage = useCallback((index) => () => {
        dispatch({
            type: REMOVE_UPDATE_IMAGE,
            data: index,
        });
    });

    useEffect(() => {
        if(updatePostDone) {
            onCancelUpdate();
        }
    },[updatePostDone]);

    const onClickCancel = useCallback(() => {
        setEditText(postContent);
        onCancelUpdate();
    });

    return (
        <div>
            {editMode
            ?(
                <>
                    <Form style={{ margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={() => onChangePost(editText)}>
                        <TextArea value={editText} onChange={onChangeText}/>
                        <div>
                            <input 
                                type="file" 
                                name="image" 
                                multiple hidden 
                                ref={imageInput} 
                                onChange={onChangeImages}
                                key={updateImagePaths.join(',')}
                            />
                            <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                            <Button.Group>
                                <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
                                <Button type="danger"  onClick={onClickCancel}>취소</Button>
                            </Button.Group>
                        </div>
                        <div>
                            {updateImagePaths.map((v,i) => (
                                <div key={v} style={{display: 'inline-block'}}>   
                                    <img src={v.replace(/\/thumb\//, '/original/')} style={{width:'200px'}} alt={v}/>
                                    <div>
                                        <Button onClick={onRemoveImage(i)}>제거</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Form>


                </>
            ) 
            : postContent.split(/(#[^\s#]+)/g).map((v,i) => {
                if(v.match(/(#[^\s#]+)/)) {
                    return <Link href={`/hashtag/${v.slice(1)}`} prefecth={false} key={i}><a>{v}</a></Link>
                }
                return v;
            })}
    </div>
    ) 
};


PostCardContent.propTypes = {
    postContent: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    onChangePost: PropTypes.func.isRequired,
    onCancelUpdate: PropTypes.func.isRequired,
};
PostCardContent.defaultProps = {
    editMode: false,
};

export default PostCardContent;