import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, message, Alert, Space, Typography, Spin } from 'antd';
import { FolderOutlined, FolderAddOutlined, LoginOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Configuration d'axios avec l'URL de base
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

const UserFolderSection = () => {
    const [folderExists, setFolderExists] = useState(false);
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return expiry > Date.now();
        } catch (e) {
            console.error('Erreur lors de la vérification du token:', e);
            return false;
        }
    };

    const checkUserFolder = async () => {
        if (!isAuthenticated()) {
            setError('Veuillez vous connecter pour accéder à votre dossier');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.get('/api/user-folder', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            
            setFolderExists(response.data.folderExists);
            setFolderName(response.data.folderName);
            setError(null);
            
            if (response.data.message) {
                message.info(response.data.message);
            }
        } catch (error) {
            console.error('Erreur complète:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la vérification du dossier';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const createUserFolder = async () => {
        if (!isAuthenticated()) {
            setError('Veuillez vous connecter pour créer un dossier');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.post('/api/user-folder', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setFolderExists(response.data.folderExists);
            setFolderName(response.data.folderName);
            setError(null);
            message.success(response.data.message || 'Dossier créé avec succès');
        } catch (error) {
            console.error('Erreur complète:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création du dossier';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserFolder();
    }, []);

    if (!isAuthenticated()) {
        return (
            <Card title={<Title level={4}>Votre Dossier Personnel</Title>} bordered={false}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <LoginOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    <Text>Veuillez vous connecter pour accéder à votre dossier</Text>
                    <Button 
                        type="primary"
                        href="/login"
                        icon={<LoginOutlined />}
                    >
                        Se connecter
                    </Button>
                </Space>
            </Card>
        );
    }

    return (
        <Card 
            title={<Title level={4}>Votre Dossier Personnel</Title>}
            bordered={false}
            extra={
                <Button 
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={checkUserFolder}
                    loading={loading}
                >
                    Rafraîchir
                </Button>
            }
        >
            {error && (
                <Alert
                    message="Erreur"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                    <Text style={{ display: 'block', marginTop: '10px' }}>
                        Chargement de votre dossier...
                    </Text>
                </div>
            ) : folderExists ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FolderOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Text strong>Votre dossier est prêt :</Text>
                        <Text code>{folderName}</Text>
                    </div>
                    <Text type="secondary">
                        Vous pouvez maintenant télécharger vos fichiers dans ce dossier.
                    </Text>
                </Space>
            ) : (
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <FolderAddOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                    <Text>Aucun dossier personnel trouvé</Text>
                    <Button 
                        type="primary" 
                        onClick={createUserFolder}
                        loading={loading}
                        icon={<FolderAddOutlined />}
                    >
                        Créer Mon Dossier
                    </Button>
                </Space>
            )}
        </Card>
    );
};

export default UserFolderSection;
