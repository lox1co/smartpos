import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  heroAvatarWrapper: {
    marginBottom: 12,
  },
  heroAvatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eff4fe',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroAvatarImage: {
    width: '100%',
    height: '100%',
  },
  defaultAvatarContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  defaultAvatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  heroEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  heroEmailText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  editProfileOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  editProfileOutlineBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4,
  },
});
