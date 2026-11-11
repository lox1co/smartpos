import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from './backup-modal.styles';

interface BackupModalProps {
  readonly visible: boolean;
  readonly lastBackup: string;
  readonly onBackup: () => void;
  readonly onRestore: () => void;
  readonly onClose: () => void;
}

export const BackupModal = ({
  visible,
  lastBackup,
  onBackup,
  onRestore,
  onClose,
}: BackupModalProps) => {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('settings:system.backupTitle')}</Text>
          <Text style={styles.sub}>
            {t('settings:system.backupSub', { date: lastBackup })}
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              onClose();
              onBackup();
            }}
          >
            <MaterialIcons name="cloud-upload" size={20} color="#004ac6" />
            <Text style={styles.actionText}>Export & Create Backup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.restoreBtn]}
            onPress={() => {
              onClose();
              onRestore();
            }}
          >
            <MaterialIcons name="cloud-download" size={20} color="#0d9488" />
            <Text style={[styles.actionText, styles.restoreText]}>Restore Database</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>{t('common:actions.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
