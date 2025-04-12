import React, { useRef, useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Send } from 'lucide-react';
import { Siren } from '@/types';
import { socket } from '@/lib/socket';

interface SirenControlDialogProps {
	siren: Siren;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const SirenControlDialog: React.FC<SirenControlDialogProps> = ({ siren, isOpen, onOpenChange }) => {
	// States for form values
	const [communicationType, setCommunicationType] = useState<string>(siren.type?.[0] || 'GPRS');
	const [alarmType, setAlarmType] = useState<string>('warning');
	const [playing, setPlaying] = useState(false);
	const [isWaitingForAck, setIsWaitingForAck] = useState(false);
	const [currentStatus, setCurrentStatus] = useState(siren.status);
	const [lastCheckedTime, setLastCheckedTime] = useState(siren.lastChecked);

	// Refs for form inputs
	const intervalRef = useRef<HTMLInputElement>(null);
	const langRef = useRef<HTMLInputElement>(null);
	const frequencyRef = useRef<HTMLInputElement>(null);
	const messageRef = useRef<HTMLTextAreaElement>(null);
	const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Socket event listeners
	useEffect(() => {
		const handleSirenAck = (data: { sirenId: string; running: boolean }) => {
			if (data.sirenId === siren.id) {
				setPlaying(data.running);
				setIsWaitingForAck(false);
			}
		};

		const handleStatusChange = (data: { sirenId: string; status: string; lastChecked: Date }) => {
			if (data.sirenId === siren.id) {
				setCurrentStatus(data.status as 'active' | 'inactive' | 'warning' | 'alert');
				setLastCheckedTime(data.lastChecked.toISOString());
			}
		};

		// Listen for siren acknowledgements
		socket.on('siren-acked', handleSirenAck);

		// Listen for status changes
		socket.on('siren-status-change', handleStatusChange);

		// Setup status check interval
		if (isOpen) {
			// Start polling for status every 500ms
			statusIntervalRef.current = setInterval(() => {
				socket.emit('siren-status-check', siren.id);
			}, 500);
		}

		// Setup listener for status updates
		socket.on(
			'siren-status-update',
			(data: { sirenId: string; status: string; playing: boolean; lastChecked: Date }) => {
				if (data.sirenId === siren.id) {
					setCurrentStatus(data.status as 'active' | 'inactive' | 'warning' | 'alert');
					setPlaying(data.playing);
					setLastCheckedTime(data.lastChecked.toISOString());
				}
			}
		);

		return () => {
			// Clean up event listeners
			socket.off('siren-acked', handleSirenAck);
			socket.off('siren-status-change', handleStatusChange);
			socket.off('siren-status-update');

			// Clear interval
			if (statusIntervalRef.current) {
				clearInterval(statusIntervalRef.current);
				statusIntervalRef.current = null;
			}
		};
	}, [siren.id, isOpen]);

	// Also handle open/close to manage interval
	useEffect(() => {
		if (!isOpen && statusIntervalRef.current) {
			clearInterval(statusIntervalRef.current);
			statusIntervalRef.current = null;
		} else if (isOpen && !statusIntervalRef.current) {
			statusIntervalRef.current = setInterval(() => {
				socket.emit('siren-status-check', siren.id);
			}, 500);
		}

		return () => {
			if (statusIntervalRef.current) {
				clearInterval(statusIntervalRef.current);
				statusIntervalRef.current = null;
			}
		};
	}, [isOpen, siren.id]);

	// Handler for toggling siren
	const handleToggleSiren = () => {
		if (isWaitingForAck) return;

		const newState = !playing;
		setIsWaitingForAck(true);

		socket.emit('siren-control', {
			sirenId: siren.id,
			action: newState ? 'on' : 'off',
			alertType: alarmType,
			gapAudio: Number(intervalRef.current?.value || 0),
			language: langRef.current?.value || 'en',
			frequency: Number(frequencyRef.current?.value || 1),
		});
	};

	// Handler for sending message
	const handleSendMessage = () => {
		if (messageRef.current?.value) {
			socket.emit('siren-control', {
				sirenId: siren.id,
				action: messageRef.current.value,
				alertType: alarmType,
				gapAudio: Number(intervalRef.current?.value || 0),
				language: langRef.current?.value || 'en',
				frequency: Number(frequencyRef.current?.value || 1),
			});

			// Clear message field after sending
			if (messageRef.current) {
				messageRef.current.value = '';
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className='text-xl font-semibold'>{siren.name}</span>
							<Badge variant={currentStatus === 'active' ? 'default' : 'destructive'}>
								{currentStatus}
							</Badge>
						</div>
						<DialogClose asChild></DialogClose>
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-6 py-4'>
					{/* Siren Information Section */}
					<Card>
						<CardContent className='p-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>ID</Label>
									<p className='text-sm'>{siren.id}</p>
								</div>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>Location</Label>
									<p className='text-sm'>{siren.location}</p>
								</div>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>District</Label>
									<p className='text-sm'>{siren.district}</p>
								</div>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>Block</Label>
									<p className='text-sm'>{siren.block}</p>
								</div>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>Last Checked</Label>
									<p className='text-sm'>{new Date(lastCheckedTime).toLocaleString()}</p>
								</div>
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-muted-foreground'>Type</Label>
									<p className='text-sm'>{siren.type.join(', ')}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Controls Section */}
					<div className='space-y-4'>
						<div className='flex items-center justify-between rounded-lg border p-4'>
							<div className='space-y-1'>
								<Label className='text-sm font-medium'>Siren Status</Label>
								<p className='text-sm text-muted-foreground'>
									{isWaitingForAck
										? 'Waiting for siren response...'
										: playing
										? 'Siren is currently active'
										: 'Siren is inactive'}
								</p>
							</div>
							<Switch
								id='toggle-siren'
								checked={playing}
								onCheckedChange={handleToggleSiren}
								disabled={isWaitingForAck || currentStatus !== 'active'}
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='communication-type' className='text-sm font-medium'>
									Communication Medium
								</Label>
								<Select
									value={communicationType}
									onValueChange={setCommunicationType}
									disabled={isWaitingForAck}
								>
									<SelectTrigger id='communication-type'>
										<SelectValue placeholder='Select type' />
									</SelectTrigger>
									<SelectContent>
										{siren.type.map(type => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
										<SelectItem value='Cellular (4G)'>Cellular (4G)</SelectItem>
										<SelectItem value='VSAT'>VSAT</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='alarm-type' className='text-sm font-medium'>
									Alarm Type
								</Label>
								<Select value={alarmType} onValueChange={setAlarmType} disabled={isWaitingForAck}>
									<SelectTrigger id='alarm-type'>
										<SelectValue placeholder='Select type' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='warning'>Warning</SelectItem>
										<SelectItem value='air-raid'>Air Raid</SelectItem>
										<SelectItem value='nuclear'>Nuclear</SelectItem>
										<SelectItem value='navy'>Navy</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='interval' className='text-sm font-medium'>
									Gap Between Audio (seconds)
								</Label>
								<Input
									id='interval'
									ref={intervalRef}
									type='number'
									defaultValue='0'
									min='0'
									disabled={isWaitingForAck}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='language' className='text-sm font-medium'>
									Language
								</Label>
								<Input id='language' ref={langRef} defaultValue='en' disabled={isWaitingForAck} />
							</div>
						</div>

						<div className='grid grid-cols-1 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='frequency' className='text-sm font-medium'>
									Frequency (times to repeat)
								</Label>
								<Input
									id='frequency'
									ref={frequencyRef}
									type='number'
									defaultValue='1'
									min='1'
									disabled={isWaitingForAck}
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='message' className='text-sm font-medium'>
								Text to transmit
							</Label>
							<Textarea
								id='message'
								ref={messageRef}
								placeholder='Enter message to broadcast'
								className='min-h-24'
								disabled={isWaitingForAck || currentStatus !== 'active'}
							/>
						</div>
					</div>
				</div>

				<DialogFooter className='flex justify-end gap-2'>
					<Button
						variant={playing ? 'destructive' : 'default'}
						size='sm'
						onClick={handleToggleSiren}
						className='gap-2'
						disabled={isWaitingForAck || currentStatus !== 'active'}
					>
						{playing ? (
							<>
								<BellOff className='h-4 w-4' /> Stop Siren
							</>
						) : (
							<>
								<Bell className='h-4 w-4' /> Activate Siren
							</>
						)}
					</Button>
					<Button
						variant='default'
						size='sm'
						onClick={handleSendMessage}
						disabled={!messageRef.current?.value || isWaitingForAck || currentStatus !== 'active'}
						className='gap-2'
					>
						<Send className='h-4 w-4' /> Send Message
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SirenControlDialog;
