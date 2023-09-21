import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

export default function ContactFormScreen() {
    const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdpcsQC_oDWH79mPIKlAWWvr4cVk1S8K4JCYKme7xBT8LGi5Q/viewform';

    const openGoogleForm = () => {
    Linking.openURL(googleFormURL);
    };

    return (
    <View style={styles.container}>
        <Text style={styles.title}>お問い合わせ</Text>
        <View style={styles.header}>
            <Text style={styles.description}>
                回答まで1週間ほどお時間をいただく場合がございます。
            </Text>
            <Text style={styles.description}>
                お問い合わせ内容送信後、入力されたメールアドレスへ受付完了メールが届きます。
            </Text>
            <Text style={styles.description}>
                受付完了メールが届かない場合は、メールアドレスの入力に誤りがある可能性があるため、再度お問い合わせ内容を送信してください
            </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
            <Text style={styles.buttonText}>お問い合わせフォームを開く</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    header: {
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff', // 背景色を白に変更
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
        lineHeight: 24,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});
