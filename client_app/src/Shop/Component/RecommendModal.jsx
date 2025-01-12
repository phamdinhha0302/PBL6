import { useState, useRef } from 'react';
import recommendAPI from '../../API/recommendAPI';

const RecommendModal = ({ handler_Search }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [imageURL, setImageURL] = useState(null);
    const [itemName, setItemName] = useState(null);
  const fileUploadRef = useRef();

  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.click();
  };

  const uploadImageDisplay = (fileImage) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (fileImage && validTypes.includes(fileImage.type)) {
      const cachedURL = URL.createObjectURL(fileImage);
      setTimeout(() => {
        setImageURL(cachedURL);
      }, 1000);
    } else {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
    }
  };

  const fetchDetectAPI = async () => {
    const file = fileUploadRef.current.files[0];
    if (!file) {
      alert('Please upload an image!');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await recommendAPI.getRecommendProduct(formData);
      const detectedItem = response.data.predicted_category;
      setItemName(detectedItem);

      handler_Search(detectedItem);

        setIsOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleRemoveImage = () => {
    setImageURL(null);
    fileUploadRef.current.value = null;
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Tìm kiếm bằng hình ảnh
      </button>

      {/* Main Modal */}
          {modalIsOpen && (
          <>
          {/* Lớp phủ mờ */}
          <div
            className="modal-backdrop show"
            style={{
              backdropFilter: 'blur(5px)', // Làm mờ background
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Tăng tối màu overlay
            }}
          ></div>
        <div className="modal show d-block mt-8" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  id="form"
                  className="position-relative"
                  encType="multipart/form-data"
                >
                  <div
                    className="drop-area border rounded p-3"
                    onClick={handleImageUpload}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      minHeight: '200px',
                      borderStyle: 'dashed',
                    }}
                  >
                    {imageURL ? (
                      <img
                        src={imageURL}
                        alt="Uploaded"
                        className="img-fluid"
                        style={{ maxHeight: '150px' }}
                      />
                    ) : (
                      <div>
                        <p>Drop your image here, or click to browse</p>
                        <p>Supports: PNG, JPG, JPEG, WEBP</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileUploadRef}
                    onChange={(e) => uploadImageDisplay(e.target.files[0])}
                    hidden
                  />
                  {imageURL && (
                    <button
                      type="button"
                      className="btn btn-danger mt-3"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn btn-primary ${!imageURL ? 'disabled' : ''}`}
                  onClick={fetchDetectAPI}
                  disabled={!imageURL}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
                  </div>
                  </>
      )}
    </div>
  );
};

export default RecommendModal;
