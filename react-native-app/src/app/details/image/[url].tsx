import { View, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ImageViewScreen() {
    const { url } = useLocalSearchParams<{ url: string }>();

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: url }}
                style={styles.fullscreenImage}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
    },
});
