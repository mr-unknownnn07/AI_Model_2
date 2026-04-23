"""
Convert TF.js Teachable Machine model → Keras H5
Maps weights by name to avoid order mismatch.
"""
import json, os, numpy as np
import tf_keras as keras

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

# 1. Load topology
with open(os.path.join(MODEL_DIR, "model.json")) as f:
    cfg = json.load(f)

topology_str = json.dumps(cfg["modelTopology"])
model = keras.models.model_from_json(topology_str)
print("Architecture loaded:", model.name)

# 2. Read weights into a dictionary
weight_manifest = cfg["weightsManifest"]
weights_bin_path = os.path.join(MODEL_DIR, "weights.bin")
raw = open(weights_bin_path, "rb").read()

specs = []
for group in weight_manifest:
    specs.extend(group["weights"])

offset = 0
weight_data_map = {}
for spec in specs:
    name = spec["name"]
    dtype = np.dtype(spec["dtype"])
    shape = spec["shape"]
    n     = int(np.prod(shape)) if shape else 1
    nb    = n * dtype.itemsize
    arr   = np.frombuffer(raw[offset:offset+nb], dtype=dtype).reshape(shape)
    weight_data_map[name] = arr
    offset += nb

print(f"Loaded {len(weight_data_map)} weight tensors from binary")

# 3. Assign weights to model layers by name
for layer in model.layers:
    # Some layers are nested (Sequential/Model)
    layers_to_process = [layer]
    if isinstance(layer, (keras.Sequential, keras.Model)):
        layers_to_process = layer.layers
        
    for sublayer in layers_to_process:
        # If it's still a container, we might need recursion, but TM models usually aren't that deep.
        # Let's try handling one more level for TM structure.
        actual_layers = [sublayer]
        if isinstance(sublayer, (keras.Sequential, keras.Model)):
            actual_layers = sublayer.layers
            
        for l in actual_layers:
            if not l.weights:
                continue
            
            new_weights = []
            for w in l.weights:
                # Keras weight names are usually 'layer_name/weight_type:0'
                # TF.js manifest names are usually 'layer_name/weight_type'
                clean_name = w.name.split(':')[0]
                if clean_name in weight_data_map:
                    new_weights.append(weight_data_map[clean_name])
                else:
                    print(f"Warning: Weight {clean_name} not found in manifest!")
                    new_weights.append(w.numpy()) # Keep original if not found
            
            if new_weights:
                try:
                    l.set_weights(new_weights)
                except Exception as e:
                    print(f"Error setting weights for layer {l.name}: {e}")

# 4. Save as H5
out_path = os.path.join(os.path.dirname(__file__), "model_keras.h5")
model.save(out_path)
print(f"Saved → {out_path}")
