import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import {randomDefaultColor} from './randomDefaultColor';
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
    const url = `https://avatars.dicebear.com/api/avataaars/:seed${randomNumber}.svg?background=${randomDefaultColor()}`
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
        <div className={`image-upload__preview ${props.circle && "circle"}`}>
         {previewUrl && <img src={previewUrl} alt="Preview" className={ props.circle && 'circle'} /> }      
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
        {props.randomButton && <Button inverse  type="button" onClick={random}>RANDOM</Button>}
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;