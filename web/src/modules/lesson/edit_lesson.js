import React from 'react';
import Container from '../../component/container';

import fd from '../../base/fetchData';

import { Button, Table, Spin, Modal, Form, Input, InputNumber } from 'antd';

class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false
        }
    }
    //显示弹层
    handler_show() {
        this.setState({
            visible: true
        });
    }
    //关闭弹层
    handler_hidden() {
        this.setState({
            visible: false
        });
    }

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }

        this.props.form.validateFields((error, values) => {
            if (!error) {
                //比create方法多回传一个主键的值 
                values.lesson_id = this.props.editRecord.lesson_id;

                //验证通过，提交请求
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.lesson.update, values).then(() => {
                    this.setState({ submitting: false });
                    this.handler_hidden();
                    this.props.handler_refresh();
                }).catch((error) => {
                    Modal.error({
                        title: "添加教室出错",
                        content: error.message
                    })
                    this.setState({ submitting: false });
                });
            }
        });


    }

    componentDidMount() {
        if (this.props.editRecord) {
            const { lesson_name, length, level, remark } = this.props.editRecord;

            this.props.form.setFieldsValue({
                lesson_name, length, level, remark
            });
        }
    }

    render() {
        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单内输入项大小比例 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        const FormItem = Form.Item;

        return (
            <Modal
                title="添加教室"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => this.handler_submit(e)}>
                    <FormItem
                        {...formItemLayout}
                        label="课程名称"
                    >
                        {getFieldDecorator('lesson_name', {
                            rules: [{
                                max: 30,
                                message: `最多只能输入30个字`
                            }, {
                                required: true,
                                message: '必需输入名称',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="课时数量"
                    >
                        {getFieldDecorator('length', {
                            rules: [{
                                required: true,
                                message: '必需输入!',
                            }],
                            initialValue: 3
                        })(
                            <InputNumber max={5000} min={1} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="课程等级"
                    >
                        {getFieldDecorator('level', {
                            rules: [{
                                required: true,
                                message: '必需输入教室容量!',
                            }],
                            initialValue: 1
                        })(
                            <InputNumber max={5} min={1} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注信息"
                    >
                        {getFieldDecorator('remark', {
                            rules: [{
                                max: 200,
                                message: `最多只能输入200个字`
                            }],
                        })(
                            <Input.TextArea />
                            )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.submitting}>提交</Button>

                        <Button onClick={() => this.handler_hidden()} style={{ marginLeft: 15 }} >关闭</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(Edit)