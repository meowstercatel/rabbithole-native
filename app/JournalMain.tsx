import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Menu, Search, Camera } from 'react-native-feather';
import rabbitHoleClient from './rabbitHoleClient';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from "expo-router";

function truncateString(text: string) {
    const maxLength = 24;
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.slice(0, maxLength) + "...";
    }
}

export default function RabbitholeUI() {
    const [fetchedEntries, setFetchedEntries] = useState(false);
    const [journalEntries, setJournalEntries] = useState([{ question: "", answer: "", date: "", id: "", magicCam: false, renderDate: false }]);
    const [lastEntryDate, setLastEntryDate] = useState("");

    //if (!fetchedEntries) {
    useEffect(() => {
        // console.log(rabbitHoleClient.accessToken);

        SecureStore.getItemAsync("token").then(secureToken => {
        //     if(!secureToken) {
        //         router.replace("/loginPage");
        //         return;
        //     }

            rabbitHoleClient.accessToken = secureToken ? secureToken : "123";
            rabbitHoleClient.fetchUserJournal().then(response => { if(response.status == 500) {router.replace("/loginPage")}; return response.json() }).then(data => {
                let entries = [];
                for (const entry of data.journal.entries) {
                    const question = entry.title;
                    const date = new Date(entry.createdOn).toDateString();
                    let magicCam = entry.type == "magic-camera" ? true : false;
                    const id = entry._id;
                    const answerData = JSON.stringify(entry.data.conversationData);
                    let renderDate = false;
                    if (lastEntryDate != date) {
                        renderDate = true;
                        setLastEntryDate(date);
                    }
                    let answer = "";
                    if (typeof answerData != 'undefined') {
                        answer = truncateString(entry.data.conversationData.textContent);
                    }
                    entries.push({ question: question, answer: answer, date: date, magicCam: magicCam, id: id, renderDate: renderDate })
                }
                setFetchedEntries(true);
                console.log(Date.now());
                setJournalEntries(entries);
            })
        })
    }, []);
    //}
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' hidden={true} translucent={false} backgroundColor='#000000' />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>Journal</Text>
                <TouchableOpacity>
                    <Menu stroke="white" width={24} height={24} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search stroke="gray" width={20} height={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="search"
                    placeholderTextColor="#6b7280"
                />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* August 25 */}
                <View style={styles.entriesContainer}>
                    {journalEntries.map((entry, index) => (
                        <View key={index} style={styles.entryItem}>
                            <View style={styles.dot} />
                            <Link style={{ flex: 1 }} href={{
                                pathname: "/JournalEntryView",
                                params: { id: entry.id }
                            }}>
                                <View style={styles.entryContent}>
                                    {entry.magicCam ?
                                        <Text style={styles.magicCamera}>{entry.question}</Text>
                                        :
                                        <Text style={styles.question}>{entry.question}</Text>}
                                    <Text style={styles.answer}>{entry.answer}</Text>
                                </View>
                            </Link>
                            <Text style={styles.time}>{entry.date}</Text>
                        </View>

                    ))}
                </View>

                {/* July 15 */}
                {/*<Text style={styles.dateHeader}>july 15</Text>
                <View style={styles.entriesContainer}>
                    {[10, 8, 6].map((minutes, index) => (
                        <View key={index} style={styles.entryItem}>
                            <Camera stroke="#22d3ee" width={24} height={24} />
                            <View style={styles.entryContent}>
                                <Text style={styles.magicCamera}>Magic Camera</Text>
                                {index === 0 && (
                                    <Image
                                        source={{ uri: 'https://via.placeholder.com/128x80' }}
                                        style={styles.cameraImage}
                                    />
                                )}
                            </View>
                            <Text style={styles.time}>{`10:${59 - minutes} pm`}</Text>
                        </View>
                    ))}
                </View>
                */}
            </ScrollView>
        </SafeAreaView>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 12,
    },
    scrollView: {
        flex: 1,
    },
    dateHeader: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    entriesContainer: {
        marginBottom: 24,
    },
    entryItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginTop: 6,
        marginRight: 16,
    },
    entryContent: {
        flex: 1,
    },
    question: {
        color: 'white',
        fontSize: 16,
        marginBottom: 4,
    },
    answer: {
        color: '#6b7280',
        fontSize: 14,
    },
    time: {
        color: '#6b7280',
        fontSize: 12,
    },
    magicCamera: {
        color: '#22d3ee',
        fontSize: 16,
        marginBottom: 8,
    },
    cameraImage: {
        width: 128,
        height: 80,
        borderRadius: 8,
        marginTop: 8,
    },
});