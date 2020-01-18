'''
Updates the jacoco thresholds in pom.xml based on the reports.
'''

from os.path import join
import lxml.etree as ET


def write(file, tree):
    '''
    Workaround for LXML writing XML declaration using single quotes instead of double.
    '''
    xml_str = '\n'.join(
        ('<?xml version="1.0" encoding="UTF-8"?>',
         ET.tostring(tree, pretty_print=True,
                     encoding='unicode', xml_declaration=False))
    )
    with open(file, 'w', encoding='utf8') as stream:
        stream.write(xml_str)


def update_pom_properties(properties):
    '''
    Updates the <properties> of the pom.xml
    '''
    parser = ET.XMLParser(strip_cdata=False)
    tree = ET.parse('pom.xml', parser)
    root = tree.getroot()
    properties_element = root.find(
        '{http://maven.apache.org/POM/4.0.0}properties')

    for key, value in properties.items():
        property_element = properties_element.find(
            '{http://maven.apache.org/POM/4.0.0}' + key)
        property_element.text = value

    write('pom.xml', tree)


def read_jacoco_xml(path):
    '''
    Reads the top level counters of a jacoco.xml file.
    Returns a dictionary generator where the keys are the counter names
    and the values are the percentages of coverage.
    Examples of keys: INSTRUCTION, BRANCH
    '''
    xml_path = join('target', 'site', path, 'jacoco.xml')
    root = ET.parse(xml_path).getroot()
    for counter in root.findall('counter'):
        counter_type = counter.get('type')
        missed = float(counter.get('missed'))
        covered = float(counter.get('covered'))
        yield counter_type, str(int(covered * 100 / (covered + missed))) + '%'


def main():
    '''
    Updates jacoco counters in pom.xml based on jacoco's reports.
    '''
    unit_jacoco = dict(read_jacoco_xml('jacoco'))
    print(unit_jacoco)
    aggregate_jacoco = dict(read_jacoco_xml('jacoco-aggregate'))
    print(aggregate_jacoco)
    properties = {
        'jacoco.unit-tests.limit.instruction-ratio': unit_jacoco['INSTRUCTION'],
        'jacoco.unit-tests.limit.branch-ratio': unit_jacoco['BRANCH'],
        'jacoco.aggregate.limit.instruction-ratio': aggregate_jacoco['INSTRUCTION'],
        'jacoco.aggregate.limit.branch-ratio': aggregate_jacoco['BRANCH']
    }
    print(properties)
    update_pom_properties(properties)


if __name__ == "__main__":
    main()
