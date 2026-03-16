# 🧠 AXON: Drug–Drug Interaction Prediction System

This project predicts potential **drug–drug interactions (DDIs)** using machine learning models trained on large biomedical datasets. It aims to assist healthcare systems in automatically alerting doctors about harmful drug combinations.

-----

## 📂 Project Structure

The project structure is as follows:

```
AI/
├── .venv/                   # Python Virtual Environment
├── data/
│   ├── DeepLGF/             # Auxiliary data (e.g., knowledge graph data)
│   └── Twosides/            # TwoSides DDI data
├── models/                  # Trained model checkpoints
├── notebooks/
│   ├── testing.ipynb        # Notebook for model testing/evaluation
│   └── data_exploration.ipynb # Data investigation and initial analysis
├── src/
│   ├── config/
│   │   └── paths.py         # Configuration for file paths
│   ├── utils.py             # Utility functions
│   ├── predict.py           # Script for making predictions
│   ├── preprocess.py        # Script for data preprocessing
│   └── train_model.py       # Script for model training
├── tests/
├── .gitignore
├── requirements.txt         # Project dependencies
└── README.md
```

-----

## ⚙️ Installation & Setup

1. **Clone the repository**

    Use the provided **SSH link** to clone the repository:

    ```bash
    git clone git@github.com:Abdallah-Hassan-Ahmed/AXON.git
    cd AXON
    ```

2. **Create and activate a virtual environment**

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate    # for Linux/Mac
    .venv\Scripts\activate      # for Windows
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

-----

## 📦 Dataset

The datasets used in this project originate from the following repositories:

* **TwoSides dataset repository:** [jcsun-00/Twosides](https://github.com/jcsun-00/Twosides) — Includes `ddis.csv`, `drug_smiles.csv`. ([GitHub][1])
* **DeepLGF repository:** [MrPhil/DeepLGF](https://github.com/MrPhil/DeepLGF) — Includes training methodology for DDIs based on knowledge graphs, contributing to the `data/DeepLGF/` structure. ([GitHub][2])

> **Setup Steps:**
>
> 1. Download the required files (including the potentially compressed data) from the TwoSides repo and place them into `data/Twosides/`.
> 2. The `Twosides/` directory also contains:
>       * **`id_data_dict_dsn_full_connect.pkl`**: A pre-processed data dictionary used by the training pipeline.
>       * **`fold0/`, `fold1/`, `fold2/`**: Directories containing the data splits for cross-validation.
> 3. If your data is compressed, use the provided scripts:
>
>     ```bash
>     # To decompress the large data files
>     bash data/Twosides/decompress.sh
>    ```
> ````
> # Use this script to re-compress them after local use
> bash data/Twosides/compress.sh
> ```
> ````
>
> **Note**: Large datasets are excluded from Git via `.gitignore`.

-----

## 🚀 Running the Project

### Data Exploration & Testing

**Explore data (Jupyter Notebook):**

```bash
jupyter notebook notebooks/data_exploration.ipynb
```

**Test model/evaluate splits (Jupyter Notebook):**

```bash
jupyter notebook notebooks/testing.ipynb
```

### Preprocessing, Training, and Prediction

**Preprocess and train:**

```bash
python3 src/preprocess.py
python3 src/train_model.py
```

**Make predictions:**

```bash
python3 src/predict.py
```

-----

## 📚 Requirements

See [`requirements.txt`](https://www.google.com/search?q=./requirements.txt) for all dependencies.

-----

## 📜 License

This project is for **academic and research purposes only**. All dataset rights belong to their respective authors.

[1]: https://www.google.com/search?q=%5Bhttps://github.com/jcsun-00/Twosides%5D\(https://github.com/jcsun-00/Twosides\) "GitHub - jcsun-00/Twosides: The TwoSides Dataset for the paper \"HDN-DDI: a novel framework for predicting drug-drug interactions using hierarchical molecular graphs and enhanced dual-view representation learning\""
[2]: https://www.google.com/search?q=%5Bhttps://github.com/MrPhil/DeepLGF/tree/master%5D\(https://github.com/MrPhil/DeepLGF/tree/master\) "GitHub - MrPhil/DeepLGF"
