import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {Button, Input} from 'antd';
import { useSelector } from 'react-redux';
const {TextArea} = Input;
const PostCardContent = ({postData, editMode, onChangePost, onCancelUpdate}) => { //첫 번째 게시글 #해시태그 #행복한집사생활 에서 해시태그 
    const {updatePostLoading, updatePostDone} = useSelector((state) => state.post);
    const [editText, setEditText] = useState(postData); //porps를 state로
    const onChangeText = useCallback((e) => {
        setEditText(e.target.value);
    });
    useEffect(() => {
        if(updatePostDone) {
            onCancelUpdate();
        }
    },[updatePostDone]);

    const onClickCancel = useCallback(() => {
        setEditText(postData);
        onCancelUpdate();
    });




    return (
        <div>
            {editMode
            ?(
                <>
                    <TextArea value={editText} onChange={onChangeText}/>
                    <Button.Group>
                        <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
                        <Button type="danger"  onClick={onClickCancel}>취소</Button>
                    </Button.Group>
                </>
            ) 
            : postData.split(/(#[^\s#]+)/g).map((v,i) => {
                if(v.match(/(#[^\s#]+)/)) {
                    return <Link href={`/hashtag/${v.slice(1)}`} prefecth={false} key={i}><a>{v}</a></Link>
                }
                return v;
            })}
    </div>
    ) 
};


PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
    editMode: PropTypes.bool,
    onChangePost: PropTypes.func.isRequired,
    onCancelUpdate: PropTypes.func.isRequired,
};
PostCardContent.defaultProps = {
    editMode: false,
};

export default PostCardContent;