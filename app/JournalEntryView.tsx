import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Menu, ChevronLeft, ChevronRight, Image as ImageIcon, Smile } from 'react-native-feather';
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from 'expo-router';
import rabbitHoleClient from './rabbitHoleClient';

export default function JournalEntryView() {
    const params = useLocalSearchParams();
    const { id } = params;
    const [entry, setEntry] = useState({ date: "", question: "", answer: "", magicCam: false, id: "", magicCamImg: "" });

    useEffect(() => {
        rabbitHoleClient.fetchJournalEntry(id.toString()).then(response => response.json()).then(async data => {
            const date = new Date(data.entry.createdOn).toDateString();
            const question = data.entry.title;
            const id = data.entry._id;
            let magicCam = data.entry.type == "magic-camera" ? true : false;
            let magicCamImg = "";
            if (magicCam) {
                let magicCamImgLocation = data.entry.data.magicCameraData.aiGeneratedImages.length !== 0 ?
                data.entry.data.magicCameraData.aiGeneratedImages[0].url
                :
                data.entry.data.magicCameraData.originalImage.url
                let magicCamImageResponse = await rabbitHoleClient.fetchJournalEntryResources([magicCamImgLocation]);
                let magicCamImageData = await magicCamImageResponse.json();
                magicCamImg = magicCamImageData.resources[0]
            }
            // let magicCamImageResponse = await rabbitHoleClient.fetchJournalEntryResources([data.entry.data.magicCameraData.aiGeneratedImages[0].url]);
            // let magicCamImageData = await magicCamImageResponse.json();
            // magicCamImg = magicCamImageData.resources[0]
            let answerData = data.entry.data.conversationData;
            let answer = "";
            if (typeof answerData != 'undefined') {
                answer = answerData.textContent;
            }
            if(magicCam) {
                answer = data.entry.data.magicCameraData.textContent ? data.entry.data.magicCameraData.textContent : "";
            }
            setEntry({
                date: date,
                question: question,
                answer: answer,
                magicCam: magicCam,
                magicCamImg: magicCamImg,
                id: id
            })
        })
    }, [])
    return (
        <>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <StatusBar style="auto" translucent={false} backgroundColor='#000000' />
                    <Text style={styles.logo}>Journal</Text>
                    <TouchableOpacity>
                        <Menu stroke="white" width={24} height={24} />
                    </TouchableOpacity>
                </View>

                {/* Journal Entry */}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.navigationContainer}>
                        <TouchableOpacity>
                            <ChevronLeft stroke="gray" width={24} height={24} />
                        </TouchableOpacity>
                        <Text style={styles.dateHeader}>{entry.question}</Text>
                        <TouchableOpacity>
                            <ChevronRight stroke="gray" width={24} height={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.articleContainer}>
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'space-evenly', flexDirection: "row", }}>
                            <Text style={styles.time}>{entry.date}</Text>
                            {entry.magicCam && <View style={[styles.tag, { backgroundColor: '#164e63' }]}>
                                <Text style={[styles.tagText, { color: '#67e8f9' }]}>magic cam</Text>
                            </View>}
                        </View>
                        {/* <View style={styles.tagsContainer}> */}
                        {/* magic cam element */}
                        {/* </View> */}

                        <Text style={styles.paragraph}>{entry.answer}</Text>

                        {entry.magicCam && <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: `${entry.magicCamImg == "" ? "https://crossbrowserajax.com/blog/data/upload/2017/04/responsive_images.jpg" : entry.magicCamImg}` }}
                                style={styles.image}
                            />
                            {/*<View style={styles.imageCaption}>
                                <ImageIcon stroke="white" width={16} height={16} />
                                <Text style={styles.imageCaptionText}>Afternoon walk by the lake</Text>
                            </View>*/}
                        </View>}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollView: {
        flex: 1,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    dateHeader: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    articleContainer: {
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    tag: {
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 8,
    },
    tagText: {
        fontSize: 12,
    },
    moodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    moodText: {
        color: '#facc15',
        marginLeft: 4,
    },
    paragraph: {
        color: '#d1d5db',
        marginBottom: 16,
        lineHeight: 26,
        fontSize: 16
    },
    time: {
        color: '#6b7280',
        marginBottom: 16,
        fontSize: 16,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        width: 300,
        height: 300,
        /*width: '100%',
        height: 500,*/
        borderRadius: 8,
    },
    imageCaption: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    imageCaptionText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 4,
    },
});