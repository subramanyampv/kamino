from xml.dom.minidom import parse


def read_version(file):
    '''
    Reads the version defined in a pom.xml file
    '''
    with parse(file) as document:
        project = document.getElementsByTagName('project')[0]
        version = project.getElementsByTagName('version')[0]
        return version.firstChild.nodeValue
