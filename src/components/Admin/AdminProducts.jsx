import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Spinner,
  Chip,
  Select,
  SelectItem,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress
} from '@nextui-org/react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaSave,
  FaUndo,
  FaImage,
  FaTshirt,
  FaCampground,
  FaTag,
  FaUpload,
  FaSpinner
} from 'react-icons/fa';
import { authService } from '../../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '';

const CATEGORIES = [
  { key: 'uniforms', label: 'Uniformes', icon: <FaTshirt /> },
  { key: 'accessories', label: 'Accesorios', icon: <FaTag /> },
  { key: 'camping', label: 'Camping', icon: <FaCampground /> },
  { key: 'other', label: 'Otros', icon: <FaBox /> }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const fileInputRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_percent: '0',
    category: 'accessories',
    sizes: [],
    stock: '0',
    images: [],
    is_active: true
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const getAuthHeaders = async () => {
    const session = await authService.getSession();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`
    };
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/admin/products`, { headers });
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      discount_percent: '0',
      category: 'accessories',
      sizes: [],
      stock: '0',
      images: [],
      is_active: true
    });
    onOpen();
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discount_percent: (product.discount_percent || 0).toString(),
      category: product.category,
      sizes: product.sizes || [],
      stock: (product.stock || 0).toString(),
      images: product.images || [],
      is_active: product.is_active
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      setProcessing(true);
      const headers = await getAuthHeaders();

      const payload = {
        ...form,
        price: parseFloat(form.price),
        discount_percent: parseInt(form.discount_percent),
        stock: parseInt(form.stock)
      };

      if (selectedProduct) {
        payload.id = selectedProduct.id;
        await fetch(`${API_URL}/api/admin/products`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_URL}/api/admin/products`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      onClose();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      setProcessing(true);
      const headers = await getAuthHeaders();
      await fetch(`${API_URL}/api/admin/products?id=${selectedProduct.id}`, {
        method: 'DELETE',
        headers
      });
      onDeleteClose();
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxImages = 5 - form.images.length;
    if (files.length > maxImages) {
      alert(`Máximo ${maxImages} imagen(es) más permitidas`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      if (selectedProduct?.id) {
        formData.append('product_id', selectedProduct.id);
      }

      const session = await authService.getSession();
      const response = await fetch(`${API_URL}/api/admin/products/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.urls) {
        setForm({ ...form, images: [...form.images, ...data.urls] });
      } else {
        alert(data.error || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-loading inline">
        <Spinner size="lg" color="warning" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="products-toolbar">
        <Button color="warning" startContent={<FaPlus />} onPress={openCreateModal}>
          Nuevo Producto
        </Button>
        <Button variant="flat" startContent={<FaUndo />} onPress={loadProducts}>
          Recargar
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty">
          <FaBox className="empty-icon" />
          <h2>Sin productos</h2>
          <p>Agrega tu primer producto a la tienda</p>
        </div>
      ) : (
        <Table aria-label="Products table" className="products-table">
          <TableHeader>
            <TableColumn>Producto</TableColumn>
            <TableColumn>Categoría</TableColumn>
            <TableColumn>Precio</TableColumn>
            <TableColumn>Stock</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="product-cell">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} className="product-thumb" />
                    )}
                    <div>
                      <strong>{product.name}</strong>
                      {product.discount_percent > 0 && (
                        <Chip size="sm" color="success" variant="flat">
                          -{product.discount_percent}%
                        </Chip>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {CATEGORIES.find((c) => c.key === product.category)?.label || product.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  {product.discount_percent > 0 ? (
                    <div>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="final-price">
                        {formatPrice(product.price * (1 - product.discount_percent / 100))}
                      </span>
                    </div>
                  ) : (
                    formatPrice(product.price)
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={product.stock > 0 ? 'success' : 'danger'} variant="flat">
                    {product.stock}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" color={product.is_active ? 'success' : 'default'} variant="dot">
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="action-buttons">
                    <Button
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onPress={() => openEditModal(product)}>
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      isIconOnly
                      onPress={() => confirmDelete(product)}>
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
          <ModalBody>
            <div className="product-form">
              <Input
                label="Nombre"
                placeholder="Ej: Pasapañuelo Scout"
                value={form.name}
                onValueChange={(v) => setForm({ ...form, name: v })}
                isRequired
              />

              <Textarea
                label="Descripción"
                placeholder="Descripción del producto..."
                value={form.description}
                onValueChange={(v) => setForm({ ...form, description: v })}
                minRows={2}
              />

              <div className="form-row">
                <Input
                  type="number"
                  label="Precio"
                  placeholder="0"
                  startContent="$"
                  value={form.price}
                  onValueChange={(v) => setForm({ ...form, price: v })}
                  isRequired
                />
                <Input
                  type="number"
                  label="Descuento %"
                  placeholder="0"
                  endContent="%"
                  value={form.discount_percent}
                  onValueChange={(v) => setForm({ ...form, discount_percent: v })}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-row">
                <Select
                  label="Categoría"
                  selectedKeys={[form.category]}
                  onSelectionChange={(keys) => setForm({ ...form, category: Array.from(keys)[0] })}>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.key} textValue={cat.label}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="number"
                  label="Stock"
                  placeholder="0"
                  value={form.stock}
                  onValueChange={(v) => setForm({ ...form, stock: v })}
                  min="0"
                />
              </div>

              <div className="sizes-section">
                <label>Talles disponibles:</label>
                <div className="sizes-grid">
                  {SIZES.map((size) => (
                    <Chip
                      key={size}
                      variant={form.sizes.includes(size) ? 'solid' : 'bordered'}
                      color={form.sizes.includes(size) ? 'warning' : 'default'}
                      className="size-chip"
                      onClick={() => {
                        if (form.sizes.includes(size)) {
                          setForm({ ...form, sizes: form.sizes.filter((s) => s !== size) });
                        } else {
                          setForm({ ...form, sizes: [...form.sizes, size] });
                        }
                      }}>
                      {size}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="images-section">
                <label>Imágenes ({form.images.length}/5):</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
                {uploading && (
                  <div className="upload-progress">
                    <Spinner size="sm" color="warning" />
                    <span>Subiendo imagen...</span>
                  </div>
                )}
                <div className="images-grid">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={img} alt={`Imagen ${idx + 1}`} />
                      <Button
                        size="sm"
                        color="danger"
                        isIconOnly
                        className="remove-btn"
                        onPress={() => handleRemoveImage(idx)}>
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <Button
                      variant="bordered"
                      className="add-image-btn"
                      onPress={handleAddImage}
                      isDisabled={uploading}>
                      <FaUpload /> {uploading ? 'Subiendo...' : 'Subir imagen'}
                    </Button>
                  )}
                </div>
                <p className="images-hint">
                  Máximo 5 imágenes de hasta 5MB cada una (JPG, PNG, WebP)
                </p>
              </div>

              <Switch
                isSelected={form.is_active}
                onValueChange={(v) => setForm({ ...form, is_active: v })}>
                Producto activo (visible en la tienda)
              </Switch>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="warning"
              onPress={handleSave}
              isDisabled={processing || !form.name || !form.price}
              startContent={<FaSave />}>
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Eliminar Producto</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar <strong>{selectedProduct?.name}</strong>?
            </p>
            <p className="text-small text-default-500">Esta acción no se puede deshacer.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button color="danger" onPress={handleDelete} isDisabled={processing}>
              {processing ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminProducts;
