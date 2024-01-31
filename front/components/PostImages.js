import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { REMOVE_UPDATED_IMAGE } from '../reducers/post';
import ImagesZoom from './ImagesZoom';

const PostImages = ({imagePost, editMode, updateImages, setUpdateImages}) => {
    const dispatch = useDispatch();
    const [showImagesZoom, setShowImagesZoom] = useState(false);
    const post = {...imagePost};
    // console.log('PostCard에서 post ', post);
    // console.log('PostImages에서 updateImages ', updateImages);

    const onRemoveImage = useCallback((index) => () => {
        const updatedPostImages = post.Images.filter((_,i) => i !== index);
        post.Images = [...updatedPostImages];
        dispatch({
            type: REMOVE_UPDATED_IMAGE,
            data: post
        });
        setUpdateImages(updatedPostImages);
    },[post, setUpdateImages]);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);

    const onClose = useCallback(() => {
        setShowImagesZoom(false)
    }, []);

    if(editMode) {
        if(Array.isArray(updateImages)) {
            return (
                <>
                    {updateImages.map((image, index) => (
                        <div key={image.id} style={{display: 'inline-block'}}>
                            <img role="presentation" src={`${updateImages[index].src}`} alt={updateImages[index].src} onClick={onZoom} style={{width:'200px'}}/>
                            <Button onClick={onRemoveImage(index)} style={{marginLeft:'30%'}}>제거</Button>
                        </div>
                    ))}
                    {showImagesZoom && <ImagesZoom images={updateImages} onClose={onClose}/>}
            
                </>
            )
        } else {
            return null;
        }     
    } else {
        if(updateImages.length === 1){
            return (
                <>
                    <img role="presentation" src={`${updateImages[0].src}`} alt={updateImages[0].src} onClick={onZoom}/>
                    {showImagesZoom && <ImagesZoom images={updateImages} onClose={onClose}/>}
            
                </>
            )
        }
        if(updateImages.length === 2){ 
            return (
                <>
                    <img role="presentation" style={{width:'50%', display:'inline-block'}} src={`${updateImages[0].src}`} alt={updateImages[0].src} onClick={onZoom}/>
                    <img role="presentation" style={{width:'50%', display:'inline-block'}} src={`${updateImages[1].src}`} onClick={onZoom}/>
                    {showImagesZoom && <ImagesZoom images={updateImages} onClose={onClose}/>}
                </>
            )
        }
        return (
            <>
                <div>
                    <img role="presentation" style={{ width:'50%'}} src={`${updateImages[0].src}`} alt={updateImages[0].src} onClick={onZoom}/>
                    <div 
                        role="presentation"
                        style={{ width:'50%', display: 'inline-block', textAlign: 'center', verticalAlign:'middle'}}
                        onClick={onZoom}
                    >   
                        <PlusOutlined/>
                        <br />                 
                        {updateImages.length -1}
                        개의 사진 더보기
                    </div>   
                </div> 
                {showImagesZoom && <ImagesZoom images={updateImages} onClose={onClose}/>}
            </>
        )
    }
    
}; 

PostImages.propTypes = {
    imagePost: PropTypes.object,
    editMode: PropTypes.bool,
    updateImages: PropTypes.arrayOf(PropTypes.object),
    setUpdateImages: PropTypes.func.isRequired,
};
PostImages.defaultProps = {
    editMode: false,
}

export default PostImages;