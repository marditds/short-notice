import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import defaultAvatar from '../../../assets/default.png';
import { useUserContext } from '../../../lib/context/UserContext';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar';
import { getCroppedAvatar } from '../../../lib/utils/avatarUtils';
import Cropper from 'react-easy-crop';
import { AvatarCropModal } from '../Modals';

export const Avatar = () => {

    const { userId } = useUserContext();

    const [showAvatarCropModal, setShowAvatarCropModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [showCropper, setShowCropper] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const {
        avatarUrl, isUploading, isAvatarLoading, fileFormatError, avatarUploadSuccessMsg,
        setAvatarUrl,
        handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc,
        extractFileIdFromUrl,
        setFileFormatError,
        setAvatarUploadSuccessMsg
    } = useUserAvatar(userId);

    // const handleFileChange = async (e) => {

    //     console.log('Changing avatar...');

    //     console.log('THIS IS e', e);

    //     const file = e.target.files[0];

    //     if (!file) { return; }

    //     console.log('this is FILE:', file);

    //     if (
    //         file.type
    //         !== 'image/png' &&
    //         file.type
    //         !== 'image/jpeg' &&
    //         file.type
    //         !== 'image/jpg'
    //     ) {
    //         setFileFormatError('Accepted file formats are PNG and JPG/JPEG.');
    //         setAvatarUploadSuccessMsg('');
    //         return;
    //     }

    //     if (avatarUrl) {
    //         const fileId = extractFileIdFromUrl(avatarUrl);
    //         await Promise.allSettled([
    //             handleDeleteAvatarFromStrg(fileId),
    //             handleAvatarUpload(e)
    //         ]);
    //     } else {
    //         await handleAvatarUpload(e);
    //     }
    // };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
            setFileFormatError('Accepted file formats are PNG and JPG/JPEG.');
            setAvatarUploadSuccessMsg('');
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setShowCropper(true);
            setShowAvatarCropModal(true);
        });
        reader.readAsDataURL(file);
    };

    const handleSaveCroppedImage = async () => {
        try {
            const croppedBlob = await getCroppedAvatar(imageSrc, croppedAreaPixels);

            const croppedFile = new File([croppedBlob], 'avatar.jpeg', { type: 'image/jpeg' });

            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                await handleDeleteAvatarFromStrg(fileId);
            }

            await handleAvatarUpload({ target: { files: [croppedFile] } });

            setShowCropper(false);
        } catch (error) {
            console.error('Error saving cropped image:', error);
        } finally {
            setShowAvatarCropModal(false);
        }
    };

    const handleDeleteAvatar = async (user_id) => {

        setIsDeleting(true);

        try {
            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                await Promise.allSettled([
                    handleDeleteAvatarFromStrg(fileId),
                    handleDeleteAvatarFromDoc(user_id)
                ]);
                setAvatarUrl('');
                setAvatarUploadSuccessMsg('Avatar deleted successfully.');
                setFileFormatError('');
            }
        } catch (error) {
            console.error("Error deleting avatar:", error);
            setFileFormatError('Failed to delete avatar.');
            setAvatarUploadSuccessMsg('');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCloseAvatarCropModal = () => {
        setShowAvatarCropModal(false);
    }

    return (
        <Row xs={1} sm={2} >
            <Col className='d-block align-items-baseline'>
                <h4>Update Avatar:</h4>
                <p>Add, update, or delete your avatar. Accepted file formats are PNG and JPG.</p>
            </Col>
            <Col className='d-flex justify-content-start align-items-center mt-2 mt-sm-0'>
                {!isAvatarLoading ?
                    <img
                        src={avatarUrl ? avatarUrl : defaultAvatar}
                        alt='user_avatar'
                        className='setting__avatar-display me-3'
                    />
                    :
                    <LoadingSpinner classAnun={'me-3'} />
                }

                <Form as={Row} className='flex-column settings__upload-avatar-form'>
                    <Form.Group as={Col} className="mb-2 mb-md-3" controlId="profilePictureUpload">

                        {isUploading ?
                            (
                                <>
                                    Updating avatar <LoadingSpinner />
                                </>
                            )
                            : (
                                <>
                                    <Form.Label className='settings__upload-avatar-label mb-1 mb-md-2'>Upload Avatar</Form.Label>
                                    <Form.Control
                                        type='file'
                                        accept='image/*'
                                        onChange={handleFileChange}
                                        className='settings__upload-avatar-field'

                                    />
                                </>
                            )}
                    </Form.Group>
                    <Col className="">
                        <Button
                            onClick={handleDeleteAvatar}
                            disabled={isDeleting ? true : false}
                            className='float-start settings__delete-avatar-btn'
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Avatar'}
                            {isDeleting && <LoadingSpinner />}
                        </Button>
                    </Col>
                    {fileFormatError &&
                        <Col className='mt-1 mt-md-2'>
                            <Form.Text style={{ color: 'var(--main-caution-color)' }}>
                                {fileFormatError}
                            </Form.Text>
                        </Col>
                    }

                    {avatarUploadSuccessMsg &&
                        <Col className='mt-1 mt-md-2'>
                            <Form.Text style={{ color: 'var(--main-accent-color-hover)' }}>
                                {avatarUploadSuccessMsg}
                            </Form.Text>
                        </Col>
                    }

                </Form>

            </Col>


            <AvatarCropModal
                showAvatarCropModal={showAvatarCropModal}
                isUploading={isUploading}

                handleCloseAvatarCropModal={handleCloseAvatarCropModal}
                handleSaveCroppedImage={handleSaveCroppedImage}
                loadingSpinner={<LoadingSpinner />}
            >
                {showCropper && imageSrc && (
                    // laight gray bg
                    <div className='avatar-crop-component' style={{ position: 'relative', width: '100%', height: '100%', background: '#333' }}>
                        {/* Cropper takes full size */}
                        {/* dark gray bg */}
                        <div style={{ position: 'relative', width: '100%', height: '90%' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            />
                        </div>

                        {/* Zoom Slider using Form.Range */}
                        <Form.Group controlId='zoomRange' className='px-3 mt-2'>
                            <Form.Label className='text-light small mb-1'>Zoom</Form.Label>
                            <Form.Range
                                min={1}
                                max={3}
                                step={0.05}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className='setting__avatar-crop-zoom-slider'
                            />
                        </Form.Group>

                    </div>
                )}

            </AvatarCropModal>


        </Row>
    )
}
