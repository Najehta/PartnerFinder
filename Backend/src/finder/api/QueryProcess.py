import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import gensim
from nltk.tokenize import word_tokenize


def NLP_processor(documents, type):
    """
    function to make new corpus for a certain set of documents
    :param documents: list of lists of strings
    :param type: type of repository
    :return: Corpus of the documents, list of lists of pairs (token_id, token_frequency)
    """

    if type == 'BSF':
        dir = 'Dictionary_BSF'
    elif type == 'ISF':
        dir = 'Dictionary_ISF'
    elif type == 'MST':
        dir = 'Dictionary_MST'
    else:
        dir = 'Dictionary_INNOVATION'
    # print("This is the documents",documents)
    tokens = [process_document(doc) for doc in documents]
    # print("TOKENS", tokens)
    try:

        dictionary = reload_dictionary(dir)
        # print("reloading")
    except:
        dictionary = make_dictionary([])
        # print("Making dictionary")
        dictionary.save(dir)

    dictionary.add_documents(tokens)
    dictionary.save(dir)
    # for k, v in dictionary.token2id.items():
    #     print(k, v)
    #print(dictionary.token2id)
    return build_corpus(dictionary, tokens)


def process_document(document):
    """
    function to process a certain document by 1- tokenizing it 2- remove stop words 3- making lower cas of tokens
    4- stemming each token
    :param document: string
    :return: list of tokens
    """
    ps = PorterStemmer()
  #  nltk.download('stopwords')
  #   nltk.download('punkt')

    try:
        stop_words = (stopwords.words('english'))

    except Exception as e:
        print("ERR", e)

    try:
        tokens_list = [ps.stem(word.lower()) for word in word_tokenize(document) if
                not word in stop_words]  # tokenizing and normalize tokens

    except Exception as e:
        print("ERR", e)
    # print("TokenList: ", tokens_list)
    return tokens_list


def make_dictionary(tokens):
    """
    function to build new dictionary with a certain tokens
    :param tokens: list of lists of tokens
    :return: Dictionary object
    """
    dictionary = gensim.corpora.Dictionary(tokens)
    # print("This is the dictionary",dictionary.token2id)
    return dictionary  # mapping termId : term


def build_corpus(dictionary, tokens):
    """
    function to build a corpus, which is mapping each token id to its frequency
    :param dictionary: inner dictionary object for mapping token -> token id
    :param tokens: list of lists of tokens
    :return: list of lists of tuples (id, frequency)
    """

    # for each doc map termId : term frequency
    corpus = [dictionary.doc2bow(lst) for lst in tokens]
    #print("Corpus: ", res)
    return corpus


def process_query_result(result):
    """
    function to process similarity result, it will map each document similarity percentage with the document id
    :param result: list of lists of percentages
    :return: pair of (doc id, doc similarity percentage)
    """

    if len(result) == 0:
        return []
    result = result[0]
    pairs = []
    for idx, sim_perc in enumerate(result):

        if sim_perc != 0:
            pairs.append((idx, sim_perc))
    return pairs


def add_document_to_curr_index(index, documents,type):
    """
    function to add new documents to existent index
    :param index: current index
    :param documents: list of lists of strings
    :param type: string to know which repository
    :return: updated index
    """
    corpus = NLP_processor(documents,type)
    index.num_features += len(corpus) * 1000
    for doc in corpus:
        index.num_features += (len(doc) * 2)
    index.add_documents(corpus)
    index.save()
    return index


def reload_index(path):
    """
    function to load index from a specific directory on disk
    :param path: path to directory
    :return: Similarity Object
    """

    return gensim.similarities.Similarity.load(path)


def reload_dictionary(path):
    """
    function to load dictionary from a specific directory on disk
    :param path: path to directory
    :return: Dictionary object
    """

    return gensim.corpora.Dictionary.load(path)


def make_index(path, type):
    """
    build an empty index in disk and save it on a specific directory
    :param path: path of the directory
    :param type: string to know what index b2match or eu
    :return: Similarity object "index"
    """
    corpus = NLP_processor([], type)
    tfidf = gensim.models.TfidfModel(corpus)

    # build the index
    return gensim.similarities.Similarity(path, tfidf[corpus], num_features=10000)


def get_document_from_call(info, area):
    """
    function to get the description and tags from proposal call
    :param info: call information
    :param area: tags
    :return: document
    """
    doc = [info]
    for tag in area:
        doc.append(tag)
    # s = ''.join(doc)
    # print("The document after cleaning: ", s)
    return ''.join(doc)


