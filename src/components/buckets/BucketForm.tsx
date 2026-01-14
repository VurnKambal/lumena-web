import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useFinance } from '@/context/FinanceContext';
import { Bucket, BucketCategory } from '@/types';
import { Trash2, AlertTriangle } from 'lucide-react';

interface BucketFormProps {
  isOpen: boolean;
  onClose: () => void;
  bucket?: Bucket; // If present, edit mode
}

const CATEGORIES: BucketCategory[] = ['Essentials', 'Savings', 'Tax', 'Play'];
const COLORS = [
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Amber', value: 'bg-amber-500' },
  { name: 'Rose', value: 'bg-rose-500' },
  { name: 'Slate', value: 'bg-slate-500' },
];

export function BucketForm({ isOpen, onClose, bucket }: BucketFormProps) {
  const { addBucket, updateBucket, deleteBucket } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState<BucketCategory>('Essentials');
  const [color, setColor] = useState(COLORS[0].value);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (bucket) {
      setName(bucket.name);
      setTarget(bucket.target ? bucket.target.toString() : '');
      setCategory(bucket.category);
      setColor(bucket.color || COLORS[0].value);
    } else {
      // Reset for new bucket
      setName('');
      setTarget('');
      setCategory('Essentials');
      setColor(COLORS[0].value);
    }
    setIsDeleting(false);
  }, [bucket, isOpen]);

  const handleSubmit = () => {
    if (!name) return;

    const newBucketData = {
      name,
      category,
      target: target ? parseFloat(target) : undefined,
      color,
      percentage: bucket?.percentage || 0, // Preserve allocation % if exists, else 0
      amount: bucket?.amount || 0,
    };

    if (bucket) {
      updateBucket({ ...newBucketData, id: bucket.id });
    } else {
      addBucket({ ...newBucketData, id: Date.now().toString() });
    }
    onClose();
  };

  const handleDelete = () => {
    if (bucket) {
      deleteBucket(bucket.id);
      onClose();
    }
  };

  if (isDeleting) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Delete Bucket">
        <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-slate-600">
                Are you sure you want to delete <strong>{bucket?.name}</strong>?
                <br />
                <span className="text-sm text-red-500 font-medium flex items-center justify-center mt-2 gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Any funds (${bucket?.amount.toFixed(2)}) will be lost/untracked.
                </span>
            </p>
            <div className="flex gap-3 justify-center mt-6">
                <Button variant="ghost" onClick={() => setIsDeleting(false)}>Cancel</Button>
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    Yes, Delete
                </Button>
            </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={bucket ? 'Edit Bucket' : 'New Bucket'}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Bucket Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vacation"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="target">Target Amount (Optional)</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <Input
                id="target"
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0.00"
                className="pl-8 tabular-nums"
              />
            </div>
          </div>

          <div>
             <Label>Category</Label>
             <div className="grid grid-cols-2 gap-2 mt-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-2 rounded-lg text-sm border transition-all ${
                            category === cat
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
             </div>
          </div>

          <div>
            <Label>Color Theme</Label>
            <div className="flex gap-3 mt-2">
                {COLORS.map((c) => (
                    <button
                        key={c.name}
                        onClick={() => setColor(c.value)}
                        className={`w-8 h-8 rounded-full ${c.value} transition-all ${
                            color === c.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        aria-label={c.name}
                    />
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
            {bucket ? (
                <button
                    onClick={() => setIsDeleting(true)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            ) : <div></div>}
            <Button onClick={handleSubmit} disabled={!name}>
                {bucket ? 'Save Changes' : 'Create Bucket'}
            </Button>
        </div>
      </div>
    </Modal>
  );
}
