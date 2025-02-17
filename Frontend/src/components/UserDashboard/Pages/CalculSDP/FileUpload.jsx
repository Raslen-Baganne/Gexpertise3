import React, { useState } from 'react';
import { Upload, message, Button, Progress, Space, Typography, List } from 'antd';
import { InboxOutlined, FileOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Text, Paragraph } = Typography;

const FileUpload = () => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        setUploading(true);
        setCurrentProgress(0);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setCurrentProgress(progress);
                }
            });

            message.success('Téléchargement réussi !');
            setFileList([]);
            setCurrentProgress(0);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            message.error('Erreur lors du téléchargement. Veuillez réessayer.');
        } finally {
            setUploading(false);
        }
    };

    const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            // Vérifier si c'est un fichier DWG
            const isDWG = file.name.toLowerCase().endsWith('.dwg');
            if (!isDWG) {
                message.error('Seuls les fichiers DWG sont acceptés !');
                return false;
            }

            // Vérifier la taille du fichier (max 50MB)
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                message.error('Le fichier doit faire moins de 50MB !');
                return false;
            }

            // Limiter à un seul fichier
            if (fileList.length >= 1) {
                message.warning('Vous ne pouvez télécharger qu\'un seul fichier à la fois');
                return false;
            }

            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
        multiple: false
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Dragger {...props} style={{ 
                padding: '20px',
                background: fileList.length === 0 ? '#fafafa' : '#f0f5ff',
                border: '2px dashed #1890ff',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
            }}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ 
                        color: '#1890ff', 
                        fontSize: '48px',
                        opacity: fileList.length === 0 ? 1 : 0.5
                    }} />
                </p>
                <p className="ant-upload-text" style={{ 
                    fontSize: '16px', 
                    fontWeight: 500,
                    color: fileList.length === 0 ? '#000000d9' : '#1890ff'
                }}>
                    {fileList.length === 0 
                        ? 'Glissez votre fichier DWG ici' 
                        : 'Fichier prêt à être téléchargé'}
                </p>
                <p className="ant-upload-hint" style={{ color: '#666' }}>
                    Format accepté : DWG uniquement (Max: 50MB)
                </p>
            </Dragger>

            {fileList.length > 0 && (
                <div style={{ marginTop: '16px', textAlign: 'left' }}>
                    <List
                        size="small"
                        dataSource={fileList}
                        renderItem={file => (
                            <List.Item
                                style={{
                                    padding: '12px',
                                    background: '#f0f5ff',
                                    borderRadius: '6px',
                                    border: '1px solid #d9d9d9'
                                }}
                                actions={[
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={<DeleteOutlined />}
                                        onClick={() => props.onRemove(file)}
                                    />
                                ]}
                            >
                                <Space>
                                    <FileOutlined style={{ color: '#1890ff' }} />
                                    <Text strong>{file.name}</Text>
                                    <Text type="secondary">({(file.size / 1024 / 1024).toFixed(2)} MB)</Text>
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
            )}

            {currentProgress > 0 && (
                <div style={{ marginTop: '16px' }}>
                    <Progress 
                        percent={currentProgress}
                        strokeColor="#1890ff"
                        trailColor="#f0f5ff"
                    />
                </div>
            )}

            <div style={{ marginTop: '24px' }}>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    icon={<CheckCircleOutlined />}
                    size="large"
                    style={{
                        minWidth: '200px',
                        height: '48px',
                        borderRadius: '24px',
                        fontSize: '16px'
                    }}
                >
                    {uploading ? 'Téléchargement...' : 'Calculer la SDP'}
                </Button>
            </div>

            {fileList.length === 0 && (
                <div style={{ marginTop: '24px', textAlign: 'left' }}>
                    <Paragraph type="secondary">
                        <Text strong>Comment préparer votre fichier :</Text>
                        <ul style={{ marginTop: '8px' }}>
                            <li>Utilisez un fichier DWG propre et bien structuré</li>
                            <li>Assurez-vous que toutes les couches sont correctement nommées</li>
                            <li>Vérifiez que toutes les surfaces sont fermées</li>
                            <li>Taille maximale : 50 MB</li>
                        </ul>
                    </Paragraph>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
