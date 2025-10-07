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
  Alert,
  Platform
} from 'react-native';

// Initial sample tickets with new text
const initialTickets = [
  {
    id: '1',
    title: 'Authentication System Failure',
    description: 'Critical issue preventing user access with special characters in credentials',
    status: 'In Progress',
    priority: 'High',
    rating: null
  },
  {
    id: '2',
    title: 'Search UI content',
    description: 'Complete redesign of landing page experience with modern aesthetics',
    status: 'Open',
    priority: 'Medium',
    rating: null
  },
  {
    id: '3',
    title: 'Add new features',
    description: 'Enhanced database query execution for faster response times',
    status: 'Resolved',
    priority: 'Low',
    rating: 5
  }
];

// StatusBadge Component with new design
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Open':
        return { backgroundColor: '#8B5CF6', color: '#FFFFFF' };
      case 'In Progress':
        return { backgroundColor: '#F59E0B', color: '#FFFFFF' };
      case 'Resolved':
        return { backgroundColor: '#06B6D4', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#64748B', color: '#FFFFFF' };
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

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = () => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', icon: '🔥' };
      case 'Medium':
        return { backgroundColor: '#FEF3C7', color: '#D97706', icon: '⚡' };
      case 'Low':
        return { backgroundColor: '#D1FAE5', color: '#059669', icon: '✓' };
      default:
        return { backgroundColor: '#F1F5F9', color: '#64748B', icon: '●' };
    }
  };

  const priorityStyle = getPriorityStyle();

  return (
    <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor }]}>
      <Text style={styles.priorityIcon}>{priorityStyle.icon}</Text>
      <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
        {priority}
      </Text>
    </View>
  );
};

// RatingStars Component with new colors
const RatingStars = ({ rating, onRate, editable = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingLabel}>Rating: </Text>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onRate(star)}
          disabled={!editable}
        >
          <Text style={[styles.star, rating >= star && styles.starFilled]}>
            {rating >= star ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// TicketItem Component with new design
const TicketItem = ({ ticket, onEdit, onDelete, onRate }) => {
  return (
    <View style={styles.ticketItem}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketTitleRow}>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <PriorityBadge priority={ticket.priority} />
        </View>
        <View style={styles.ticketActions}>
          <TouchableOpacity onPress={() => onEdit(ticket)} style={styles.iconButton}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(ticket.id)} style={styles.iconButton}>
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.ticketDescription}>{ticket.description}</Text>
      
      <View style={styles.ticketFooter}>
        <StatusBadge status={ticket.status} />
        {ticket.status === 'Resolved' && (
          <RatingStars 
            rating={ticket.rating} 
            onRate={(rating) => onRate(ticket.id, rating)}
            editable={true}
          />
        )}
      </View>
    </View>
  );
};

// Main App Component
export default function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium'
  });

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormData({ title: '', description: '', status: 'Open', priority: 'Medium' });
    setModalVisible(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority
    });
    setModalVisible(true);
  };

  const handleSaveTicket = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingTicket) {
      setTickets(tickets.map(ticket =>
        ticket.id === editingTicket.id
          ? { ...ticket, ...formData, rating: formData.status !== 'Resolved' ? null : ticket.rating }
          : ticket
      ));
    } else {
      const newTicket = {
        id: Date.now().toString(),
        ...formData,
        rating: null
      };
      setTickets([...tickets, newTicket]);
    }

    setModalVisible(false);
    setFormData({ title: '', description: '', status: 'Open', priority: 'Medium' });
  };

  const handleDeleteTicket = (id) => {
    Alert.alert(
      'Delete Support Ticket',
      'Are you sure you want to permanently remove this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTickets(tickets.filter(ticket => ticket.id !== id))
        }
      ]
    );
  };

  const handleRateTicket = (id, rating) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id ? { ...ticket, rating } : ticket
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Center</Text>
        <Text style={styles.headerSubtitle}>Manage your tickets efficiently</Text>
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTicket}
      >
        <Text style={styles.addButtonText}>+ Create New Ticket</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTicket ? 'Update Ticket' : 'Create New Ticket'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ticket Title"
              placeholderTextColor="#94A3B8"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the issue in detail..."
              placeholderTextColor="#94A3B8"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Status:</Text>
            <View style={styles.statusPicker}>
              {['Open', 'In Progress', 'Resolved'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    formData.status === status && styles.statusOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, status })}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      formData.status === status && styles.statusOptionTextActive
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Priority:</Text>
            <View style={styles.priorityPicker}>
              {['Low', 'Medium', 'High'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityOption,
                    formData.priority === priority && styles.priorityOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, priority })}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      formData.priority === priority && styles.priorityOptionTextActive
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveTicket}
              >
                <Text style={styles.saveButtonText}>
                  {editingTicket ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  listContent: {
    padding: 16,
  },
  ticketItem: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ticketHeader: {
    marginBottom: 12,
  },
  ticketTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
    flex: 1,
    marginRight: 8,
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
    padding: 4,
  },
  editIcon: {
    fontSize: 20,
    color: '#06B6D4',
  },
  deleteIcon: {
    fontSize: 20,
    color: '#EF4444',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 14,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    marginRight: 4,
  },
  star: {
    fontSize: 18,
    color: '#475569',
    marginHorizontal: 1,
  },
  starFilled: {
    color: '#F59E0B',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    margin: 16,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#F1F5F9',
    backgroundColor: '#0F172A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusPicker: {
    marginBottom: 20,
  },
  statusOption: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#0F172A',
  },
  statusOptionActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    fontWeight: '600',
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priorityPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: '#0F172A',
  },
  priorityOptionActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  priorityOptionText: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    fontWeight: '600',
  },
  priorityOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#F1F5F9',
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});