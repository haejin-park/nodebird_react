import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';

const PostForm = () => {
        const {imagePaths, addPostDone} = useSelector((state) => state.post);
        const dispatch = useDispatch();
        const [text, onChangeText, setText] = useInput('');   
        
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
                type: UPLOAD_IMAGES_REQUEST,
                data: imageFormData,
            });
        });

        const onRemoveImage = useCallback((index) => () => {
            dispatch({
                type: REMOVE_IMAGE,
                data: index,
            });
        });
        useEffect(() => {
            if(addPostDone) {
                setText('');
            }
        }, [addPostDone]);

        const onSubmit = useCallback(()=> {
            if(!text || !text.trim()) {
                return alert('게시글을 작성하세요!');
            }
            const formData = new FormData();
            imagePaths.forEach((p) => {
                formData.append('image', p);
            });
            formData.append('content', text);
            dispatch({
                type: ADD_POST_REQUEST,
                data: formData,
            });
        },[text, imagePaths]);
       
    return (
        <Form style={{ margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea 
                value={text} 
                onChange={onChangeText} 
                maxLength={240} 
                placeholder="어떤 신기한 일이 있었나요?"
                style={{ width: '100%' }} 
            />
            <div>
                <input 
                    type="file" 
                    name="image" 
                    multiple hidden 
                    ref={imageInput} 
                    onChange={onChangeImages}
                    key={imagePaths.join(',')} // imagePaths가 변경될 때마다 강제 리렌더링(imagePaths 배열의 모든 항목을 문자열로 결합하면 배열이 변경될 때마다 다른 key 값이 생성되어 input 태그가 새로운 요소로 간주되고 리렌더링 됨)
                />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{float:'right'}} htmlType="submit">짹짹</Button>
            </div>
            <div>
                {imagePaths.map((v,i) => (
                    <div key={v} style={{display: 'inline-block'}}>   
                        <img src={v.replace(/\/thumb\//, '/original/')} style={{width:'200px'}} alt={v}/>
                        <div>
                            <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    )
}
export default PostForm;