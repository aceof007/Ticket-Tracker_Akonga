import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'Created' });

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) {
      return Alert.alert('Missing Info', 'Please fill all fields');
    }

    if (editingTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === editingTicket.id ? { ...t, ...form } : t))
      );
    } else {
      setTickets((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form, rating: null },
      ]);
    }

    setForm({ title: '', description: '', status: 'Created' });
    setEditingTicket(null);
    setVisible(false);
  };

  const handleDelete = (id) =>
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Yes', onPress: () => setTickets((t) => t.filter((x) => x.id !== id)) },
    ]);

  const handleRate = (id, rating) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, rating } : t)));

  const getStatusColor = (s) =>
    s === 'Created' ? '#3B82F6' : s === 'Under Assistance' ? '#F59E0B' : '#10B981';

  const openModal = (ticket = null) => {
    setEditingTicket(ticket);
    setForm(ticket ? { title: ticket.title, description: ticket.description, status: ticket.status } : { title: '', description: '', status: 'Created' });
    setVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{item.description}</Text>
      <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>

      {item.status === 'Completed' && (
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRate(item.id, star)}>
              <Text style={styles.star}>{star <= (item.rating || 0) ? '★' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🎟️ Ticket Tracker</Text>
      <FlatList
        data={tickets}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No tickets yet</Text>}
        contentContainerStyle={{ padding: 16 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingTicket ? 'Edit Ticket' : 'New Ticket'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChangeText={(t) => setForm({ ...form, title: t })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              value={form.description}
              onChangeText={(t) => setForm({ ...form, description: t })}
              multiline
            />

            <Picker
              selectedValue={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}>
              <Picker.Item label="Created" value="Created" />
              <Picker.Item label="Under Assistance" value="Under Assistance" />
              <Picker.Item label="Completed" value="Completed" />
            </Picker>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#E5E7EB' }]}
                onPress={() => setVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#3B82F6' }]}
                onPress={handleSave}>
                <Text style={styles.save}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#1F2937',
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  delete: { color: '#EF4444', fontSize: 22, marginLeft: 8 },
  desc: { color: '#6B7280', marginVertical: 8 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', marginBottom: 10 },
  star: { fontSize: 24, color: '#F59E0B', marginRight: 4 },
  editBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editText: { color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, marginHorizontal: 5, paddingVertical: 10, borderRadius: 8 },
  cancel: { textAlign: 'center', fontWeight: '600', color: '#374151' },
  save: { textAlign: 'center', fontWeight: '600', color: '#fff' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});

export default App;
