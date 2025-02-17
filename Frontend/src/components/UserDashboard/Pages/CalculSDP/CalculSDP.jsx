import React from 'react';
import { Card, Row, Col, Typography, Space, Alert } from 'antd';
import { CalculatorOutlined, FileOutlined } from '@ant-design/icons';
import FileUpload from './FileUpload';
import UserFolderSection from './UserFolderSection';

const { Title, Text } = Typography;

const CalculSDP = () => {
    return (
        <div style={{ 
            height: 'calc(100vh - 64px)', // Hauteur totale moins la navbar
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            padding: '16px'
        }}>
            {/* Header Section - Hauteur fixe */}
            <div style={{ 
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                marginBottom: '16px'
            }}>
                <Title 
                    level={3}
                    style={{
                        margin: '0 0 4px 0',
                        color: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <CalculatorOutlined /> Surface De Plancher
                </Title>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                    Calculez automatiquement votre Surface De Plancher à partir de vos fichiers DWG
                </Text>
            </div>

            {/* Alert - Hauteur fixe */}
            <Alert
                message="Format accepté : DWG uniquement"
                description="Pour garantir la précision des calculs, seuls les fichiers au format DWG sont acceptés."
                type="info"
                showIcon
                style={{ 
                    marginBottom: '16px',
                    borderRadius: '8px',
                    padding: '8px 16px'
                }}
            />

            {/* Main Content - Hauteur flexible */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <Row gutter={[16, 16]} style={{ height: '100%' }}>
                    {/* File Upload Section */}
                    <Col xs={24} lg={12} style={{ height: '100%' }}>
                        <Card 
                            title={
                                <Space>
                                    <FileOutlined style={{ color: '#1890ff' }}/>
                                    <span>Téléchargement DWG</span>
                                </Space>
                            }
                            bordered={false}
                            className="dashboard-card"
                            style={{
                                height: '100%',
                                borderRadius: '8px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                            bodyStyle={{
                                height: 'calc(100% - 57px)', // Hauteur totale moins le header de la carte
                                padding: '16px',
                                overflow: 'auto'
                            }}
                        >
                            <FileUpload />
                        </Card>
                    </Col>

                    {/* User Folder Section */}
                    <Col xs={24} lg={12} style={{ height: '100%' }}>
                        <UserFolderSection />
                    </Col>
                </Row>
            </div>

            {/* Custom CSS */}
            <style jsx global>{`
                .dashboard-card {
                    transition: all 0.3s ease;
                }
                
                .dashboard-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }

                .ant-card-head {
                    padding: 0 16px;
                    min-height: 48px;
                }

                .ant-card-head-title {
                    font-weight: 500;
                    padding: 12px 0;
                }

                .ant-alert {
                    border: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .ant-alert-message {
                    font-size: 14px;
                }

                .ant-alert-description {
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default CalculSDP;
