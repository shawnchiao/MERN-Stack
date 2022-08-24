import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend= ()=> {
        setPreviewUrl(reader.result);
      } ;
      reader.readAsDataURL(file);     
    }
  },[file])

  const random = () => {
    const randomNumber = Math.round(1000*Math.random());
    const url = `https://avatars.dicebear.com/api/avataaars/:seed${randomNumber}.svg`
    setPreviewUrl(url);
    const randomPhoto = url
    props.onInput(props.id, randomPhoto, true)
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {

    let fileIsValid = isValid;
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      setFile(event.target.files[0]);
      pickedFile = event.target.files[0]
      setIsValid(true);
      fileIsValid = true;
    } else {
     fileIsValid = true;
     setIsValid(false);
    }
    props.onInput(props.id, pickedFile, fileIsValid )
  }
  console.log(previewUrl)

  return (
    <div className='form-control'>
      <input
        id={props.id}
        ref={filePickerRef}
        type='file'
        style={{ display: 'none' }}
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className='image-upload__preview'>
         {previewUrl && <img src={previewUrl} alt="Preview" /> }      
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
        <Button inverse  type="button" onClick={random}>RANDOM</Button>
      </div>
    </div>
  );
};

export default ImageUpload;