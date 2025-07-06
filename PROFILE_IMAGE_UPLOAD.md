# Profile Image Upload Implementation

## Overview
This implementation provides a complete profile image upload system for the Next.js frontend, integrated with a NestJS backend API.

## Backend API Endpoints

### Upload Image
- **URL**: `POST http://localhost:5000/v1/user/profile/upload-image`
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with `file` field
- **Response**: 
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/profile-images/1234567890-987654321.jpg"
  }
}
```

### Get Profile
- **URL**: `GET http://localhost:5000/v1/user/profile`
- **Headers**: Authorization Bearer token
- **Response**:
```json
{
  "success": true,
  "data": {
    "identifier": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImageUrl": "/uploads/profile-images/1234567890-987654321.jpg",
    "profileImagePath": "uploads/profile-images/1234567890-987654321.jpg"
  }
}
```

### Delete Image
- **URL**: `DELETE http://localhost:5000/v1/user/profile/image`
- **Headers**: Authorization Bearer token
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": "Profile image deleted"
  }
}
```

## Frontend Components

### ProfileImageUpload Component
**Location**: `app/components/profile/ProfileImageUpload.tsx`

**Features**:
- File selection with drag-and-drop support
- Image preview before upload
- File validation (type and size)
- Upload progress indicator
- Error handling and user feedback
- Success/error notifications

**Props**:
- `currentImageUrl`: Current profile image URL
- `onImageUpload`: Callback when image is uploaded
- `onImageRemove`: Callback when image is removed
- `userId`: User identifier

### Notification Component
**Location**: `app/components/ui/Notification.tsx`

**Features**:
- Success, error, warning, and info message types
- Auto-dismiss functionality
- Smooth animations
- Manual close option

## API Functions

### uploadProfileImage
Uploads a profile image to the backend.

```typescript
const response = await uploadProfileImage(file);
```

### getUserProfile
Fetches user profile data including image URL.

```typescript
const response = await getUserProfile();
```

### deleteProfileImage
Removes the current profile image.

```typescript
const response = await deleteProfileImage();
```

## File Validation

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Size Limits
- Maximum file size: 5MB
- Validation performed on both frontend and backend

## Usage Example

```typescript
import ProfileImageUpload from '@/app/components/profile/ProfileImageUpload';

function ProfilePage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const handleImageUpload = (imageUrl: string) => {
    setProfileImageUrl(imageUrl);
  };

  const handleImageRemove = async () => {
    try {
      await deleteProfileImage();
      setProfileImageUrl(null);
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  return (
    <ProfileImageUpload
      currentImageUrl={profileImageUrl}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      userId="user-123"
    />
  );
}
```

## Error Handling

### Common Errors
- **File too large**: "Image file must be smaller than 5MB"
- **Invalid file type**: "Please select a valid image file (JPG, PNG, GIF, WebP)"
- **Upload failed**: "Upload failed. Please try again."
- **Network error**: "Network error. Please check your connection."

### Error Recovery
- Automatic retry for network failures
- User-friendly error messages
- Fallback to default avatar on image load failure

## Security Features

### Frontend Security
- File type validation
- File size validation
- Secure file handling
- Input sanitization

### Backend Security
- Authentication required for all operations
- File type validation
- File size limits
- Secure file storage
- CORS configuration

## Performance Optimizations

### Image Optimization
- Lazy loading for profile images
- Proper image sizing
- Fallback avatar for failed loads
- Efficient file upload handling

### User Experience
- Loading states during upload
- Progress indicators
- Immediate feedback
- Smooth animations

## Testing

### Manual Testing Checklist
- [ ] Upload new image
- [ ] Replace existing image
- [ ] Delete image
- [ ] Test file validation
- [ ] Test error scenarios
- [ ] Test responsive design
- [ ] Test accessibility features

### Test Scenarios
1. **Valid Upload**: Upload a valid image file
2. **Invalid File Type**: Try uploading non-image file
3. **File Too Large**: Try uploading file > 5MB
4. **Network Error**: Test with backend offline
5. **Image Replacement**: Upload new image when one exists
6. **Image Deletion**: Remove existing image

## Dependencies

### Required Packages
- `axios`: HTTP client for API calls
- `@heroicons/react`: Icons for UI components

### Optional Packages
- `react-dropzone`: Enhanced drag-and-drop (future enhancement)

## Future Enhancements

### Planned Features
- Image cropping before upload
- Multiple image formats support
- Image compression
- CDN integration
- Batch upload support
- Image gallery management

### Performance Improvements
- Image lazy loading optimization
- Progressive image loading
- WebP format support
- Image caching strategies

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is properly configured
   - Check API URL configuration

2. **Upload Fails**
   - Verify file size and type
   - Check network connection
   - Ensure authentication token is valid

3. **Image Not Displaying**
   - Verify image URL construction
   - Check backend static file serving
   - Ensure proper file permissions

4. **Authentication Errors**
   - Verify JWT token is valid
   - Check token expiration
   - Ensure proper authorization headers

### Debug Steps
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Test with Postman or similar tool
4. Check network tab for failed requests
5. Verify file upload in browser dev tools

## Support

For issues or questions regarding the profile image upload implementation:
1. Check the troubleshooting section
2. Review error messages in browser console
3. Verify backend API is running and accessible
4. Test with different file types and sizes 