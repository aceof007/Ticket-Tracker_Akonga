import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';

const initialTickets = [
  {
    id: '1',
    title: 'Login Issue',
    description: 'Users facing trouble logging in with special characters.',
    status: 'Under Assistance',
    rating: null
  },
  {
    id: '2',
    title: 'Homepage Redesign',
    description: 'Revamp landing page for better UX and engagement.',
    status: 'Created',
    rating: null
  },
  {
    id: '3',
    title: 'Database Optimization',
    description: 'Improve query performance and reduce load times.',
    status: 'Completed',
    rating: 4
  }
];

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Created':
        return { backgroundColor: '#E0F2FE', color: '#0284C7' }; // Blue
      case 'Under Assistance':
        return { backgroundColor: '#FEF9C3', color: '#B45309' }; // Yellow
      case 'Completed':
        return { backgroundColor: '#D1FAE5', color: '#065F46' }; // Green
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' }; // Gray
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
      <Text style={[styles.statusText, { color: statusStyle.color }]}>
        {status}
      </Text>
    </View>
  );
};

const RatingStars = ({ rating, onRate, editable = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.ratingContainer}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onRate(star)}
          disabled={!editable}
        >
          <Text style={styles.star}>{rating >= star ? '★' : '☆'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const TicketItem = ({ ticket, onEdit, onDelete, onRate }) => (
  <View style={styles.ticketItem}>
    <View style={styles.ticketHeader}>
      <Text style={styles.ticketTitle}>{ticket.title}</Text>
      <View style={styles.ticketActions}>
        <TouchableOpacity onPress={() => onEdit(ticket)} style={styles.iconButton}>
          <Text style={styles.icon}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(ticket.id)} style={styles.iconButton}>
          <Text style={styles.icon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
    <Text style={styles.ticketDescription}>{ticket.description}</Text>
    <View style={styles.ticketFooter}>
      <StatusBadge status={ticket.status} />
      {ticket.status === 'Completed' && (
        <RatingStars 
          rating={ticket.rating} 
          onRate={(rating) => onRate(ticket.id, rating)}
          editable={true}
        />
      )}
    </View>
  </View>
);

export default function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Created'
  });

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormData({ title: '', description: '', status: 'Created' });
    setModalVisible(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status
    });
    setModalVisible(true);
  };

  const handleSaveTicket = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (editingTicket) {
      setTickets(tickets.map(ticket =>
        ticket.id === editingTicket.id
          ? { ...ticket, ...formData, rating: formData.status !== 'Completed' ? null : ticket.rating }
          : ticket
      ));
    } else {
      const newTicket = { id: Date.now().toString(), ...formData, rating: null };
      setTickets([...tickets, newTicket]);
    }

    setModalVisible(false);
    setFormData({ title: '', description: '', status: 'Created' });
  };

  const handleDeleteTicket = (id) => {
    Alert.alert(
      'Delete Ticket',
      'Are you sure you want to delete this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setTickets(tickets.filter(t => t.id !== id)) }
      ]
    );
  };

  const handleRateTicket = (id, rating) => {
    setTickets(tickets.map(ticket => ticket.id === id ? { ...ticket, rating } : ticket));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎫 My Ticket Tracker</Text>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketItem
            ticket={item}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
            onRate={handleRateTicket}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
        <Text style={styles.addButtonText}>➕ Add Ticket</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTicket ? 'Edit Ticket Details' : 'Create New Ticket'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ticket Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ticket Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusPicker}>
              {['Created', 'Under Assistance', 'Completed'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, formData.status === status && styles.statusOptionActive]}
                  onPress={() => setFormData({ ...formData, status })}
                >
                  <Text style={[styles.statusOptionText, formData.status === status && styles.statusOptionTextActive]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveTicket}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#111827', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#F3F4F6' },
  listContent: { padding: 16 },
  ticketItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ticketTitle: { fontSize: 20, fontWeight: '700', color: '#111827', flex: 1 },
  ticketActions: { flexDirection: 'row' },
  iconButton: { marginLeft: 12 },
  icon: { fontSize: 18, color: '#6B7280' },
  ticketDescription: { fontSize: 15, color: '#4B5563', marginBottom: 12 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  ratingContainer: { flexDirection: 'row' },
  star: { fontSize: 20, color: '#FBBF24', marginHorizontal: 2 },
  addButton: { backgroundColor: '#4F46E5', margin: 16, padding: 16, borderRadius: 16, alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, width: '90%', maxWidth: 400 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  label: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  statusPicker: { marginBottom: 20 },
  statusOption: { padding: 12, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, marginBottom: 8 },
  statusOptionActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  statusOptionText: { fontSize: 14, color: '#111827', textAlign: 'center' },
  statusOptionTextActive: { color: '#FFFFFF', fontWeight: '700' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6', marginRight: 8 },
  cancelButtonText: { color: '#111827', fontWeight: '600' },
  saveButton: { backgroundColor: '#4F46E5', marginLeft: 8 },
  saveButtonText: { color: '#FFFFFF', fontWeight: '700' },
});
